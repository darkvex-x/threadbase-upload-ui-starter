import { useState, useEffect, useRef } from "react";
import apiClient from "../services/apiClient.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AvatarUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const fileInputRef = useRef(null);

  // Task 3: Local preview with useEffect cleanup
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Revoke URL on cleanup
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Task 2: Client-side validation
  function validateAndSelectFile(selectedFile) {
    if (!selectedFile) return;

    // Reset previous feedback states
    setError("");
    setUploadedUrl(null);
    setProgress(0);

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.");
      setFile(null);
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum allowed size is 5MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  // Task 1: Drag-and-drop handlers
  function handleDragOver(e) {
    e.preventDefault(); // Non-negotiable rule: required so browser permits the drop
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault(); // Non-negotiable rule: required so browser does not open the file
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSelectFile(droppedFile);
    }
  }

  // Click-to-select path
  function handleFileChange(e) {
    const chosenFile = e.target.files?.[0];
    if (chosenFile) {
      validateAndSelectFile(chosenFile);
    }
  }

  function handleClickZone() {
    fileInputRef.current?.click();
  }

  // Task 4: Axios upload with progress
  async function upload() {
    if (!file) {
      setError("Please select an image file first.");
      return;
    }

    setIsUploading(true);
    setError("");
    setProgress(0);

    const formData = new FormData();
    formData.append("avatar", file); // Must match upload.single("avatar")

    try {
      // Non-negotiable rule: Do NOT set Content-Type manually!
      const response = await apiClient.post("/api/upload", formData, {
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      setUploadedUrl(response.data?.url);
    } catch (err) {
      const serverMessage = err.response?.data?.error || "Failed to upload avatar. Please try again.";
      setError(typeof serverMessage === "string" ? serverMessage : JSON.stringify(serverMessage));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="uploader">
      {/* Task 1: Drop zone with onDragOver, onDragLeave, onDrop, and dragging class */}
      <div
        className={`drop-zone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickZone}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-input"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
        />

        {/* Task 3: Local preview image */}
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Avatar preview" className="preview" />
            <span className="file-name">{file.name}</span>
            <p className="hint">Click or drag a new image to replace</p>
          </div>
        ) : (
          <div>
            <p>Choose an avatar image or drag it here</p>
            <p className="hint">JPEG, PNG, WEBP, or GIF (up to 5MB)</p>
          </div>
        )}
      </div>

      {/* Task 2: Error display */}
      {error && <p className="error">{error}</p>}

      {/* Task 4: Progress bar */}
      {(progress > 0 || isUploading) && (
        <div>
          <div className="bar">
            <div className="fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-info">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {/* Upload button */}
      <button
        className="btn-upload"
        onClick={upload}
        disabled={!file || isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Avatar"}
      </button>

      {/* Server upload result */}
      {uploadedUrl && (
        <div className="success">
          <p>Avatar uploaded successfully!</p>
          <a
            href={`${apiClient.defaults.baseURL || "http://localhost:3001"}${uploadedUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}
