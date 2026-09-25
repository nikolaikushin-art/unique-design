import { useRef, useState } from "react";
import { StudioCanvas } from "../three/StudioCanvas";
import { emptyConfig } from "../data/treatments";
import type { ConfigState, VehicleDef, CameraPreset } from "../domain/types";
import { Icon } from "./Icon";

export function CompareView({ vehicle, config, camera, onClose }: { vehicle: VehicleDef; config: ConfigState; camera: CameraPreset; onClose: () => void }) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const before = emptyConfig(vehicle.id);

  const drag = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  return (
    <div className="compare-panel" role="dialog" aria-label="Сравнение до и после">
      <div className="compare-head">
        <span>СРАВНЕНИЕ ОБРАЗА</span>
        <button onClick={onClose} aria-label="Закрыть сравнение">
          <Icon name="close" size={15} />
        </button>
      </div>
      <div
        className="compare-track"
        ref={wrapRef}
        onMouseMove={(e) => { if (e.buttons === 1) drag(e.clientX); }}
        onTouchMove={(e) => drag(e.touches[0].clientX)}
      >
        <div className="compare-layer">
          <StudioCanvas vehicle={vehicle} config={before} camera={camera} interactive={false} />
          <span className="compare-label compare-label-before">Заводской вид</span>
        </div>
        <div className="compare-layer" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <StudioCanvas vehicle={vehicle} config={config} camera={camera} interactive={false} />
          <span className="compare-label compare-label-after">Новый образ</span>
        </div>
        <div className="compare-divider" style={{ left: `${pos}%` }}>
          <span className="compare-handle" />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Переместить границу сравнения"
        className="compare-range"
      />
      <p className="modal-footnote" style={{ padding: "0 4px" }}>
        Демонстрационное сравнение носит иллюстративный характер и не обещает точный результат до осмотра автомобиля.
      </p>
    </div>
  );
}
