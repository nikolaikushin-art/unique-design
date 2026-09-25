import { useStudioStore } from "../store/useStudioStore";

const heroSrc = "./assets/ppf-studio.jpg";
const logoSrc = "./assets/unique-detailing-logo.png";

export function Welcome() {
  const setView = useStudioStore((s) => s.setView);
  const savedCount = useStudioStore((s) => s.savedConfigurations.length);

  return (
    <section className="welcome-view">
      <div className="welcome-copy">
        <img className="welcome-logo" src={logoSrc} alt="UNIQUE Detailing" />
        <h1 className="display-heading welcome-title">До того, как снят чехол.</h1>
        <p className="editorial-copy welcome-subtitle">
          Выберите автомобиль клиента и соберите итоговый образ у него на глазах — ещё до того,
          как машина заедет в бокс.
        </p>
        <div className="welcome-actions">
          <button className="primary-button" onClick={() => setView("vehicles")}>Начать</button>
          <button className="secondary-button" onClick={() => setView("vehicles")}>Мои автомобили</button>
        </div>
        {savedCount > 0 && (
          <button className="ghost-button" onClick={() => setView("saved")}>
            Мои конфигурации ({savedCount})
          </button>
        )}
      </div>
      <div className="welcome-hero" role="img" aria-label="UNIQUE Detailing — приёмный бокс студии" style={{ backgroundImage: `url(${heroSrc})` }}>
        <div className="welcome-hero-fade" />
      </div>
    </section>
  );
}
