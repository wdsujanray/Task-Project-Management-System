import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEye, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./AttachmentPreview.css";

function attachmentDetails(attachment) {
  if (typeof attachment === "string") return { name: attachment, type: "", data: "" };
  return attachment && typeof attachment === "object" ? attachment : null;
}

function textContent(data) {
  try {
    const encodedContent = data.slice(data.indexOf(",") + 1);
    const bytes = Uint8Array.from(atob(encodedContent), (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return "This text file could not be displayed.";
  }
}

function AttachmentPreview({ attachment, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const details = attachmentDetails(attachment);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  if (!details?.name) return null;

  const isImage = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(details.type);
  const isText = ["text/plain", "text/csv"].includes(details.type);
  const canPreview = Boolean(details.data) && (isImage || isText || details.type === "application/pdf");

  return (
    <>
      <button type="button" className={`attachment-view-button ${className}`.trim()} onClick={() => setIsOpen(true)}>
        <FontAwesomeIcon icon={faEye} aria-hidden="true" />
        View file
      </button>
      {isOpen && createPortal((
        <div className="attachment-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}>
          <section className="attachment-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <header className="attachment-modal-header">
              <div>
                <p className="attachment-modal-eyebrow">Attachment preview</p>
                <h2 id={titleId}>{details.name}</h2>
              </div>
              <button type="button" className="attachment-modal-close" aria-label="Close preview" onClick={() => setIsOpen(false)}>
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
              </button>
            </header>
            <div className="attachment-modal-content">
              {!details.data && <p>This older attachment only saved the file name; its contents are not available to preview.</p>}
              {details.data && isImage && <img className="attachment-preview-image" src={details.data} alt={details.name} />}
              {details.data && details.type === "application/pdf" && (
                <iframe className="attachment-preview-frame" src={details.data} title={details.name} />
              )}
              {details.data && isText && <pre className="attachment-preview-text">{textContent(details.data)}</pre>}
              {details.data && !canPreview && <p>Preview is not supported for this file type. You can download the file below.</p>}
            </div>
            <footer className="attachment-modal-footer">
              {details.data && (
                <a className="btn secondary" href={details.data} download={details.name}>
                  <FontAwesomeIcon icon={faDownload} aria-hidden="true" />
                  Download file
                </a>
              )}
              <button type="button" className="btn" onClick={() => setIsOpen(false)}>Close</button>
            </footer>
          </section>
        </div>
      ), document.body)}
    </>
  );
}

export default AttachmentPreview;