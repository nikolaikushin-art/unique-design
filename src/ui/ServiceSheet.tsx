import { Modal } from "./Chrome";
import { serviceDetails } from "../data/treatments";

export function ServiceSheet({ detailKey, onClose, onSelect }: { detailKey: string; onClose: () => void; onSelect?: () => void }) {
  const d = serviceDetails[detailKey];
  if (!d) return null;
  return (
    <Modal onClose={onClose}>
      <div className="modal-title-overline">{d.overline}</div>
      <h2>{d.title}</h2>
      <p className="modal-lede">{d.lede}</p>
      {d.protectsFrom && (
        <div className="protect-chips">
          {d.protectsFrom.map((p) => (
            <span className="protect-chip" key={p}>от {p}</span>
          ))}
        </div>
      )}
      <div>
        {d.facts.map((f) => (
          <div className="fact-row" key={f.label}>
            <span>{f.label}</span>
            <span>{f.value}</span>
          </div>
        ))}
      </div>
      {d.disclaimer && <p className="modal-footnote">{d.disclaimer}</p>}
      {onSelect && (
        <button className="primary-button" style={{ width: "100%", marginTop: 16 }} onClick={onSelect}>
          Выбрать
        </button>
      )}
    </Modal>
  );
}
