import { useStudioStore } from "../store/useStudioStore";
import { vehicles } from "../data/vehicles";

export function MyVehicles() {
  const myVehicles = useStudioStore((s) => s.myVehicles);
  const selectVehicle = useStudioStore((s) => s.selectVehicle);

  return (
    <section className="view">
      <div className="page-heading">
        <div>
          <h1 className="display-heading">Ваш гараж</h1>
          <p className="page-subtitle">Автомобили, закреплённые за вашим профилем UNIQUE.</p>
        </div>
      </div>

      {myVehicles.length > 0 && (
        <div className="config-grid" style={{ marginBottom: 30 }}>
          {myVehicles.map((v) => (
            <div className="config-card card" key={v.id}>
              <strong className="config-vehicle">{v.brand} {v.model}</strong>
              <span className="config-date">Защита: {v.protection}</span>
              {v.lastRevision && <span className="config-date">Последняя ревизия: {v.lastRevision}</span>}
              <div className="config-actions">
                <button className="secondary-button" onClick={() => v.vehicleId && selectVehicle(v.vehicleId)}>Создать конфигурацию</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="page-heading" style={{ marginBottom: 12 }}>
        <div>
          <span className="overline">Демо-каталог</span>
          <p className="page-subtitle" style={{ marginTop: 6 }}>Выберите модель из портфолио UNIQUE, чтобы открыть студию.</p>
        </div>
      </div>
      <div className="vehicle-grid">
        {vehicles.map((v) => (
          <button key={v.id} className="vehicle-card" onClick={() => selectVehicle(v.id)}>
            <div className="vehicle-card-swatch" style={{ "--paint": v.basePaint } as any} />
            <div className="vehicle-card-copy">
              <span className="overline">{v.brand}</span>
              <strong>{v.model}</strong>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
