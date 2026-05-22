import "./Tabs.css";

export type TabItem = {
  value: string;
  label: string;
  count?: number;
};

export type TabsProps = {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
};

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            className={`tabs__tab${active ? " tabs__tab--active" : ""}`}
            onClick={() => onChange(t.value)}
          >
            {t.label}
            {typeof t.count === "number" && <span className="tabs__count">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
