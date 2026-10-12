import { useState } from "react";
import apiClient from "../services/apiClient.js";

export default function AvatarUploader() {
  const [file, setFile] = useState(null);

  // TODO: Task 4 — Axios upload with progress
  async function upload() {
    // stub upload function
  }

  return (
    <div className="uploader">
      <div className="drop-zone">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <p>Choose an avatar image or drag it here</p>
      </div>

      <button className="btn-upload" onClick={upload}>
        Upload
      </button>
    </div>
  );
}
