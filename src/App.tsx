import { useEffect, useState } from "react";
import { useStudioStore } from "./store/useStudioStore";
import { TopBar, BottomNav, Toast } from "./ui/Chrome";
import { Welcome } from "./screens/Welcome";
import { Studio } from "./screens/Studio";
import { SavedConfigurations } from "./screens/SavedConfigurations";
import { MyVehicles } from "./screens/MyVehicles";
import { Profile } from "./screens/ClubAndProfile";
import { ServiceSheet } from "./ui/ServiceSheet";
import { RequestFlow } from "./ui/RequestFlow";
import { Modal } from "./ui/Chrome";
import { YandexRouteCard } from "./ui/YandexRoute";

const logoSrc = "./assets/unique-detailing-logo.png";

export default function App() {
  const view = useStudioStore((s) => s.view);
  const setView = useStudioStore((s) => s.setView);
  const savedCount = useStudioStore((s) => s.savedConfigurations.length);
  const detailKey = useStudioStore((s) => s.detailKey);
  const openDetail = useStudioStore((s) => s.openDetail);
  const requestOpen = useStudioStore((s) => s.requestOpen);
  const openRequest = useStudioStore((s) => s.openRequest);
  const toast = useStudioStore((s) => s.toast);
  const clearToast = useStudioStore((s) => s.clearToast);
  const [routeOpen, setRouteOpen] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2400);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  const showChrome = view !== "welcome";

  return (
    <div className="app-shell">
      {showChrome && (
        <TopBar active={view} savedCount={savedCount} onSelect={setView} onProfile={() => setView("profile")} onRoute={() => setRouteOpen(true)} logoSrc={logoSrc} />
      )}

      <main className={showChrome ? "has-bottom-nav" : undefined}>
        {view === "welcome" && <Welcome />}
        {view === "vehicles" && <MyVehicles />}
        {view === "studio" && <Studio />}
        {view === "saved" && <SavedConfigurations />}
        {view === "profile" && <Profile />}
      </main>

      {showChrome && <BottomNav active={view} onSelect={setView} />}

      {detailKey === "model-note" && (
        <Modal onClose={() => openDetail(null)}>
          <div className="modal-title-overline">Об этом изображении</div>
          <h2>Демонстрационный образ</h2>
          <p className="modal-lede">
            Для этого автомобиля пока не загружена лицензированная 3D-модель. Показанный кузов — процедурная
            демонстрационная форма: она честно передаёт характер цвета, плёнки и покрытий, но не повторяет точную
            геометрию Porsche 911, BMW M3 и других моделей из каталога.
          </p>
          <p className="modal-footnote">
            Студия уже умеет подключать настоящую GLB-модель: достаточно положить файл в public/models и указать его
            в src/data/vehicles.ts (поле modelUrl) — конфигуратор покрасит именно этот кузов, без правок логики.
          </p>
        </Modal>
      )}
      {detailKey && detailKey !== "model-note" && <ServiceSheet detailKey={detailKey} onClose={() => openDetail(null)} />}
      {requestOpen && <RequestFlow onClose={() => openRequest(false)} />}
      {routeOpen && (
        <Modal onClose={() => setRouteOpen(false)}>
          <div className="modal-title-overline">Проезд</div>
          <h2>Проложить маршрут</h2>
          <p className="modal-lede">Откроется Яндекс Карты с построенным маршрутом от вашего текущего местоположения до студии.</p>
          <YandexRouteCard />
        </Modal>
      )}

      <Toast message={toast} />
    </div>
  );
}
