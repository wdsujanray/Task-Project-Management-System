import { useId, useState } from "react";
import AttachmentPreview from "./AttachmentPreview";

const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_FILES = "image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,text/csv,.doc,.docx";

function AttachmentField({ value, onChange, label = "Image or file" }) {
  const inputId = useId();
  const [error, setError] = useState("");
  const attachmentName = typeof value === "string" ? value : value?.name;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setError("");
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError("Choose a file smaller than 1 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange({ name: file.name, type: file.type, data: reader.result });
    reader.onerror = () => setError("This file could not be read. Try another file.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="attachment-field">
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} type="file" accept={ACCEPTED_FILES} onChange={handleFileChange} />
      <small>Maximum file size: 1 MB</small>
      {error && <p className="form-field-error" role="alert">{error}</p>}
      {attachmentName && (
        <div className="attachment-field-selected">
          <span title={attachmentName}>{attachmentName}</span>
          <AttachmentPreview attachment={value} />
          <button type="button" className="attachment-remove-button" onClick={() => onChange(null)}>Remove</button>
        </div>
      )}
    </div>
  );
}

export default AttachmentField;