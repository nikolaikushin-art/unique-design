interface OptionCardProps {
  label: string;
  detail: string;
  price?: string;
  selected: boolean;
  onSelect: () => void;
  onInfo?: () => void;
}

export function OptionCard({ label, detail, price, selected, onSelect, onInfo }: OptionCardProps) {
  return (
    <button type="button" className={`option-card${selected ? " is-selected" : ""}`} onClick={onSelect} aria-pressed={selected}>
      <span className="option-card-copy">
        <strong>{label}</strong>
        <span>{detail}</span>
        {price && <span className="option-card-price">{price}</span>}
      </span>
      {onInfo ? (
        <span
          role="button"
          tabIndex={0}
          aria-label={`О «${label}»`}
          onClick={(e) => { e.stopPropagation(); onInfo(); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onInfo(); } }}
          style={{ display: "grid", placeItems: "center", color: "var(--muted-2)", fontSize: 11, width: 18, height: 18, borderRadius: "50%", border: "1px solid var(--line-strong)" }}
        >
          i
        </span>
      ) : (
        <span className="radio-mark" />
      )}
    </button>
  );
}
