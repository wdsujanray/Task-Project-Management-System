import { useCallback, useEffect, useRef, useState } from "react";
import { faCamera, faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ImageCropper.css";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxUploadBytes = 5 * 1024 * 1024;
const maxOutputBytes = 1024 * 1024;

function ImageCropper({
  id,
  label = "Choose image",
  helperText = "JPEG, PNG, or WebP. Maximum file size: 5 MB.",
  value = "",
  onChange,
  fallback = "Add image",
  shape = "circle",
  aspectRatio = 1,
  outputSize = 512,
  imageAlt = "Image preview",
}) {
  const fileInputRef = useRef(null);
  const cropAreaRef = useRef(null);
  const dragRef = useRef(null);
  const cropUrlRef = useRef("");
  const loadSequenceRef = useRef(0);
  const [cropImage, setCropImage] = useState(null);
  const [cropUrl, setCropUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");

  const closeCropper = useCallback(() => {
    loadSequenceRef.current += 1;
    if (cropUrlRef.current) URL.revokeObjectURL(cropUrlRef.current);
    cropUrlRef.current = "";
    setCropUrl("");
    setCropImage(null);
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  useEffect(() => {
    if (!cropImage) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeCropper();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCropper, cropImage]);

  useEffect(() => () => {
    if (cropUrlRef.current) URL.revokeObjectURL(cropUrlRef.current);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    if (!acceptedTypes.has(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > maxUploadBytes) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    if (cropUrlRef.current) URL.revokeObjectURL(cropUrlRef.current);
    cropUrlRef.current = nextUrl;
    const loadSequence = ++loadSequenceRef.current;
    const image = new Image();
    image.onload = () => {
      if (loadSequence !== loadSequenceRef.current) {
        URL.revokeObjectURL(nextUrl);
        return;
      }
      setCropUrl(nextUrl);
      setCropImage(image);
      setPosition({ x: 0, y: 0 });
      setZoom(1);
    };
    image.onerror = () => {
      if (loadSequence !== loadSequenceRef.current) return;
      URL.revokeObjectURL(nextUrl);
      cropUrlRef.current = "";
      setError("The selected file could not be read as an image.");
    };
    image.src = nextUrl;
  };

  const handlePointerDown = (event) => {
    if (!cropAreaRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: position,
    };
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    const bounds = cropAreaRef.current?.getBoundingClientRect();
    if (!bounds || !cropImage) return;

    const maxScale = Math.max(bounds.width / cropImage.naturalWidth, bounds.height / cropImage.naturalHeight) * zoom;
    const maxX = Math.max(0, (cropImage.naturalWidth * maxScale - bounds.width) / 2);
    const maxY = Math.max(0, (cropImage.naturalHeight * maxScale - bounds.height) / 2);
    const nextX = dragRef.current.origin.x + event.clientX - dragRef.current.startX;
    const nextY = dragRef.current.origin.y + event.clientY - dragRef.current.startY;
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, nextX)),
      y: Math.max(-maxY, Math.min(maxY, nextY)),
    });
  };

  const handlePointerUp = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  const handleZoomChange = (event) => {
    setZoom(Number(event.target.value));
    setPosition({ x: 0, y: 0 });
  };

  const handleCrop = () => {
    if (!cropImage || !cropAreaRef.current || typeof onChange !== "function") return;

    const bounds = cropAreaRef.current.getBoundingClientRect();
    const baseScale = Math.max(bounds.width / cropImage.naturalWidth, bounds.height / cropImage.naturalHeight);
    const sourceScale = baseScale * zoom;
    const sourceWidth = bounds.width / sourceScale;
    const sourceHeight = bounds.height / sourceScale;
    const sourceX = (cropImage.naturalWidth - sourceWidth) / 2 - position.x / sourceScale;
    const sourceY = (cropImage.naturalHeight - sourceHeight) / 2 - position.y / sourceScale;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = Math.max(1, Math.round(outputSize / aspectRatio));
    const context = canvas.getContext("2d");
    if (!context) {
      setError("This browser could not prepare the cropped image.");
      return;
    }

    context.drawImage(
      cropImage,
      Math.max(0, sourceX),
      Math.max(0, sourceY),
      Math.min(sourceWidth, cropImage.naturalWidth),
      Math.min(sourceHeight, cropImage.naturalHeight),
      0,
      0,
      canvas.width,
      canvas.height,
    );

    let quality = 0.88;
    let result = canvas.toDataURL("image/jpeg", quality);
    while (result.length > 0 && quality > 0.48) {
      const base64 = result.slice(result.indexOf(",") + 1);
      const outputBytes = Math.floor((base64.length * 3) / 4);
      if (outputBytes <= maxOutputBytes) break;
      quality -= 0.08;
      result = canvas.toDataURL("image/jpeg", quality);
    }

    const encoded = result.slice(result.indexOf(",") + 1);
    if (Math.floor((encoded.length * 3) / 4) > maxOutputBytes) {
      setError("This crop is too large to save. Try a smaller crop or another image.");
      return;
    }

    onChange(result);
    setError("");
    closeCropper();
  };

  return (
    <div className={`image-cropper image-cropper-${shape}`}>
      <div className="image-cropper-preview" style={{ aspectRatio }}>
        {value
          ? <img src={value} alt={imageAlt} />
          : <span aria-hidden="true">{fallback}</span>}
      </div>
      <div className="image-cropper-actions">
        <input
          ref={fileInputRef}
          id={id}
          className="image-cropper-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
        />
        <label className="btn image-cropper-upload" htmlFor={id}>
          <FontAwesomeIcon icon={faCamera} aria-hidden="true" />
          {label}
        </label>
        {value && (
          <button type="button" className="btn secondary" onClick={() => onChange("")}>
            Remove image
          </button>
        )}
        <small id={`${id}-help`}>{helperText}</small>
        {error && <span id={`${id}-error`} className="image-cropper-error" role="alert">{error}</span>}
      </div>

      {cropImage && (
        <div className="image-cropper-backdrop" onClick={(event) => {
          if (event.target === event.currentTarget) closeCropper();
        }}>
          <section className="image-cropper-dialog" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
            <h2 id={`${id}-title`}>Crop image</h2>
            <p>Drag the image to adjust the crop, then use the slider to zoom.</p>
            <div
              ref={cropAreaRef}
              className={`image-cropper-area image-cropper-area-${shape}`}
              style={{ aspectRatio }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <img
                src={cropUrl}
                alt=""
                draggable="false"
                style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})` }}
              />
            </div>
            <label className="image-cropper-zoom">
              Zoom
              <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={handleZoomChange} />
            </label>
            <div className="image-cropper-dialog-actions">
              <button type="button" className="btn secondary" onClick={() => {
                setPosition({ x: 0, y: 0 });
                setZoom(1);
              }}>
                <FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" />
                Reset
              </button>
              <button type="button" className="btn secondary" onClick={closeCropper}>Cancel</button>
              <button type="button" className="btn primary" onClick={handleCrop}>Use image</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default ImageCropper;
