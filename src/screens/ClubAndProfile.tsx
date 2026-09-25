import { useStudioStore } from "../store/useStudioStore";

export function Profile() {
  const setView = useStudioStore((s) => s.setView);
  const showToast = useStudioStore((s) => s.showToast);
  const savedCount = useStudioStore((s) => s.savedConfigurations.length);
  const myVehiclesCount = useStudioStore((s) => s.myVehicles.length);

  const sections: { label: string; hint?: string; onOpen: () => void }[] = [
    { label: "Мои автомобили", hint: `${myVehiclesCount}`, onOpen: () => setView("vehicles") },
    { label: "Конфигурации", hint: `${savedCount}`, onOpen: () => setView("saved") },
    { label: "Записи на обслуживание", onOpen: () => showToast("Раздел появится позже") },
    { label: "История работ", onOpen: () => showToast("Раздел появится позже") },
    { label: "Документы", onOpen: () => showToast("Раздел появится позже") },
    { label: "Настройки", onOpen: () => showToast("Раздел появится позже") },
  ];

  return (
    <section className="view">
      <div className="page-heading">
        <div>
          <h1 className="display-heading">Профиль</h1>
        </div>
      </div>
      <div className="profile-list card">
        {sections.map((s) => (
          <button className="profile-row" key={s.label} onClick={s.onOpen}>
            <span>{s.label}</span>
            <span className="profile-row-right">
              {s.hint && <span className="profile-row-hint">{s.hint}</span>}
              <span className="chevron-right">›</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
