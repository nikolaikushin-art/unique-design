import { useState } from "react";
import { Modal } from "./Chrome";
import { useStudioStore } from "../store/useStudioStore";
import { priceEstimate, bodyLabel, wheelsLabel, glassLabel, opticsLabel, interiorLabel, restorationLabel, isEmptyConfig } from "../data/treatments";
import { vehicleById, vehicleTitle } from "../data/vehicles";

type Step = "summary" | "contact" | "done";

export function RequestFlow({ onClose }: { onClose: () => void }) {
  const config = useStudioStore((s) => s.config);
  const vehicleId = useStudioStore((s) => s.vehicleId);
  const submitRequest = useStudioStore((s) => s.submitRequest);
  const customer = useStudioStore((s) => s.customer);

  const [step, setStep] = useState<Step>("summary");
  const [name, setName] = useState(customer.name ?? "");
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [email, setEmail] = useState(customer.email ?? "");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [confId, setConfId] = useState("");

  const vehicle = vehicleById(vehicleId);
  const estimate = priceEstimate(config);
  const empty = isEmptyConfig(config);

  const rows: { label: string; value: string }[] = [
    { label: "Кузов", value: bodyLabel(config) },
    { label: "Диски", value: wheelsLabel(config) },
    { label: "Стёкла", value: glassLabel(config) },
    { label: "Оптика", value: opticsLabel(config) },
    { label: "Салон", value: interiorLabel(config) },
    { label: "Восстановление", value: restorationLabel(config) },
  ].filter((r) => r.value && r.value !== "Без защиты" && r.value !== "Без обработки" && r.value !== "Без плёнки" && r.value !== "Не требуется");

  const canSubmit = name.trim().length > 1 && phone.trim().length > 5 && agree;

  const submit = () => {
    const id = submitRequest({ name, phone, email }, notes);
    setConfId(id);
    setStep("done");
  };

  return (
    <Modal onClose={onClose}>
      {step === "summary" && (
        <>
          <div className="modal-title-overline">Шаг 1 из 2</div>
          <h2>Ваша конфигурация</h2>
          <p className="modal-lede">{vehicle ? vehicleTitle(vehicle) : "Автомобиль не выбран"}</p>
          {empty ? (
            <p className="modal-lede">Пока не выбрано ни одного направления защиты. Вернитесь в студию, чтобы собрать конфигурацию.</p>
          ) : (
            <div style={{ marginBottom: 8 }}>
              {rows.map((r) => (
                <div className="fact-row" key={r.label}><span>{r.label}</span><span>{r.value}</span></div>
              ))}
            </div>
          )}
          <div className="fact-row" style={{ borderTop: "1px solid var(--line-strong)", marginTop: 4, paddingTop: 12 }}>
            <span>Предварительно</span>
            <strong>{estimate.text}</strong>
          </div>
          <p className="modal-footnote">{estimate.note}</p>
          <button className="primary-button" style={{ width: "100%", marginTop: 16 }} disabled={empty} onClick={() => setStep("contact")}>
            Продолжить
          </button>
        </>
      )}

      {step === "contact" && (
        <>
          <div className="modal-title-overline">Шаг 2 из 2</div>
          <h2>Контактные данные</h2>
          <p className="modal-lede">Мастер UNIQUE свяжется с вами для подтверждения состава работ и стоимости.</p>
          <div style={{ display: "grid", gap: 10 }}>
            <label className="field">
              <span>Имя</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" />
            </label>
            <label className="field">
              <span>Телефон</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 ___ ___ __ __" inputMode="tel" />
            </label>
            <label className="field">
              <span>Email (опционально)</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" inputMode="email" />
            </label>
            <label className="field">
              <span>Комментарий (опционально)</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Особенности автомобиля, удобное время осмотра…" />
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>Согласен(на) на обработку персональных данных для обратной связи по запросу.</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} />
              <span>Готов(а) получать новости и предложения UNIQUE Detailing.</span>
            </label>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="secondary-button" onClick={() => setStep("summary")}>Назад</button>
            <button className="primary-button" style={{ flex: 1 }} disabled={!canSubmit} onClick={submit}>
              Отправить в UNIQUE
            </button>
          </div>
          <p className="modal-footnote">Это демо-форма прототипа: запрос сохраняется локально и не отправляется в CRM.</p>
        </>
      )}

      {step === "done" && (
        <>
          <div className="modal-title-overline">Запрос отправлен</div>
          <h2>Конфигурация отправлена</h2>
          <p className="modal-lede">Мастер UNIQUE свяжется с вами для подтверждения состава работ и стоимости.</p>
          <div className="fact-row"><span>Номер конфигурации</span><strong>{confId}</strong></div>
          <button className="primary-button" style={{ width: "100%", marginTop: 16 }} onClick={onClose}>
            Понятно
          </button>
        </>
      )}
    </Modal>
  );
}
