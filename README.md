# Threadbase — Avatar Upload UI (Starter)

A React client with drag-and-drop, validation, local preview, and progress bar for image uploads to Express + Multer.

## Run both halves

```bash
# Terminal 1 — Express upload server
cd server
cp .env.example .env
npm install
npm start

# Terminal 2 — React app
cd client
cp .env.development.example .env.development
npm install
npm run dev
```

## Tasks

1. **Drag-and-drop** (`src/components/AvatarUploader.jsx`): `onDragOver`, `onDragLeave`, `onDrop` with `preventDefault()`, `isDragging` highlight, `e.dataTransfer.files[0]`.
2. **Client-side validation**: Reject non-images (`image/jpeg`, `image/png`, `image/webp`, `image/gif`) and files > 5MB.
3. **Local preview**: `URL.createObjectURL(file)` with `URL.revokeObjectURL(url)` in `useEffect` cleanup.
4. **Axios upload with progress**: `FormData`, field `avatar`, `onUploadProgress`, no manual `Content-Type`.
