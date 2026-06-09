import { useRef, useState } from "react";
import { Icon } from "@components";
import { UPLOAD_ACCEPT } from "@constants/upload";
import "./DropZone.css";

export type DropZoneProps = {
  onPick: (file: File | undefined) => void;
};

export function DropZone({ onPick }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`dropzone${dragOver ? " dropzone--over" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onPick(e.dataTransfer.files[0]);
      }}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      role="button"
      tabIndex={0}
      aria-label="Alege o arhiva .zip"
    >
      <div className="dropzone__badge">
        <Icon name="upload" size={28} stroke={2} />
      </div>
      <div className="dropzone__title">Trageti arhiva aici</div>
      <div className="dropzone__hint">
        sau <span className="dropzone__action">apasati pentru a alege</span> un fisier .zip
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_ACCEPT}
        hidden
        onChange={(e) => onPick(e.target.files?.[0])}
      />
    </div>
  );
}
