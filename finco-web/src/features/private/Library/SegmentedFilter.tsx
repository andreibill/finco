import { STATUS_FILTER_OPTIONS } from "@constants/messages";
import "./SegmentedFilter.css";

export type SegmentedFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SegmentedFilter({ value, onChange }: SegmentedFilterProps) {
  return (
    <div className="segmented" role="tablist">
      {STATUS_FILTER_OPTIONS.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          className={`segmented__opt${o.value === value ? " segmented__opt--active" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
