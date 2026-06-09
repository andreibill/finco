import { Icon } from "@components/media/Icon/Icon";
import { formatPeriodLabel } from "@utils/format";
import "./PeriodFilter.css";

export type PeriodFilterProps = {
  // Perioada selectata (an_luna, ex. "2026-05").
  value: string;
  // Perioadele disponibile (an_luna), ordonate descrescator.
  options: string[];
  onChange: (value: string) => void;
  // Cand e setat, adauga o optiune goala (ex. "Toate perioadele") plus un buton
  // de stergere — modul "filtru optional". Cand lipseste, controlul e obligatoriu:
  // o perioada e mereu selectata (comutator de luna).
  allLabel?: string;
};

// Dropdown pentru perioada (luna). Doua moduri, dupa prezenta lui `allLabel`.
export function PeriodFilter({ value, options, onChange, allLabel }: PeriodFilterProps) {
  const clearable = allLabel !== undefined;
  const active = clearable && value !== "";
  return (
    <div className={`period-filter${active ? " period-filter--active" : ""}`}>
      <Icon name="calendar" size={15} className="period-filter__icon" />
      <select
        className="period-filter__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filtreaza dupa perioada"
      >
        {clearable && <option value="">{allLabel}</option>}
        {options.map((p) => (
          <option key={p} value={p}>
            {formatPeriodLabel(p)}
          </option>
        ))}
      </select>
      {active ? (
        <button
          type="button"
          className="period-filter__clear"
          onClick={() => onChange("")}
          aria-label="Elimina filtrul de perioada"
        >
          <Icon name="x" size={14} />
        </button>
      ) : (
        <Icon name="chevron-down" size={15} className="period-filter__chevron" />
      )}
    </div>
  );
}
