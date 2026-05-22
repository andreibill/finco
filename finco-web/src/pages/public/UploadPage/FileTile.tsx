import { Icon } from "../../../components/Icon/Icon";
import { formatBytes } from "../../../utils/format";
import "./FileTile.css";

export type FileTileProps = {
  file: File;
  progress: number;
  uploading: boolean;
  done: boolean;
  onReset: () => void;
};

export function FileTile({ file, progress, uploading, done, onReset }: FileTileProps) {
  return (
    <div className={`file-tile${done ? " file-tile--done" : ""}`}>
      <div className="file-tile__head">
        <span className="file-tile__icon">
          <Icon name={done ? "check-circle-2" : "file-archive"} size={26} />
        </span>
        <div className="file-tile__info">
          <div className="file-tile__name">{file.name}</div>
          <div className="file-tile__meta">
            {formatBytes(file.size)}
            {uploading && ` · se incarca... ${progress}%`}
            {done && " · incarcat catre cabinet"}
          </div>
        </div>
        {!uploading && !done && (
          <button className="file-tile__remove" onClick={onReset} aria-label="Elimina fisierul">
            <Icon name="x" size={16} />
          </button>
        )}
      </div>
      {(uploading || done) && (
        <div className="file-tile__bar">
          <div className="file-tile__bar-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
