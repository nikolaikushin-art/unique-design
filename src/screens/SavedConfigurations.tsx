import { useStudioStore } from "../store/useStudioStore";
import type { ConfigStatus } from "../domain/types";

const statusLabels: Record<ConfigStatus, string> = {
  draft: "Черновик",
  saved: "Сохранена",
  submitted: "Отправлена",
  reviewed: "На рассмотрении",
  quoted: "Предложение готово",
};

export function SavedConfigurations() {
  const list = useStudioStore((s) => s.savedConfigurations);
  const loadConfiguration = useStudioStore((s) => s.loadConfiguration);
  const deleteConfiguration = useStudioStore((s) => s.deleteConfiguration);
  const showToast = useStudioStore((s) => s.showToast);
  const setView = useStudioStore((s) => s.setView);

  return (
    <section className="view">
      <div className="page-heading">
        <div>
          <h1 className="display-heading">Сохранённые спецификации</h1>
          <p className="page-subtitle">Черновики и отправленные запросы хранятся локально в этом браузере.</p>
        </div>
        <button className="primary-button" onClick={() => setView("vehicles")}>Новая конфигурация</button>
      </div>

      {list.length === 0 ? (
        <div className="empty-state card">
          <strong>У вас пока нет конфигураций</strong>
          <p>Соберите спецификацию защиты в студии, чтобы сохранить её здесь.</p>
          <button className="primary-button" onClick={() => setView("vehicles")}>Начать конфигурацию</button>
        </div>
      ) : (
        <div className="config-grid">
          {list.map((c) => (
            <div className="config-card card" key={c.id}>
              <div className="config-card-top">
                <span className={`status-pill status-${c.status}`}>{statusLabels[c.status]}</span>
                <span className="config-id">{c.id}</span>
              </div>
              <strong className="config-vehicle">{c.vehicleTitle}</strong>
              <span className="config-date">{new Date(c.createdAt).toLocaleDateString("ru-RU")}</span>
              <div className="config-price">{c.estimateText}</div>
              <div className="config-actions">
                <button className="secondary-button" onClick={() => loadConfiguration(c.id)}>Открыть</button>
                <button className="ghost-button" onClick={() => { navigator.clipboard?.writeText(c.id); showToast("Идентификатор скопирован"); }}>Копировать ID</button>
                <button className="ghost-button" onClick={() => deleteConfiguration(c.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
