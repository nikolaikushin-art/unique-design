import { useMemo, useState } from "react";
import { useStudioStore } from "../store/useStudioStore";
import { vehicleById, vehicleTitle, vehicles } from "../data/vehicles";
import {
  categories, categoryById, ppfOptions, colourFilms, colourById, finishLabels,
  wheelOptions, glassOptions, tintOptions, opticsOptions, interiorOptions, restorationOptions,
  ceramicBodyOption, bodyLabel, finishLabel, wheelsLabel, glassLabel, opticsLabel, interiorLabel,
  restorationLabel, priceEstimate, isEmptyConfig,
} from "../data/treatments";
import type { CategoryId, Finish } from "../domain/types";
import { StudioCanvas } from "../three/StudioCanvas";
import { OptionCard } from "../ui/OptionCard";
import { CompareView } from "../ui/CompareView";
import { Icon } from "../ui/Icon";

const cameraFor = (cat: CategoryId) => categoryById(cat).camera as any;

export function Studio() {
  const vehicleId = useStudioStore((s) => s.vehicleId);
  const config = useStudioStore((s) => s.config);
  const activeCategory = useStudioStore((s) => s.activeCategory);
  const setCategory = useStudioStore((s) => s.setCategory);
  const setView = useStudioStore((s) => s.setView);
  const selectVehicle = useStudioStore((s) => s.selectVehicle);
  const compareOpen = useStudioStore((s) => s.compareOpen);
  const toggleCompare = useStudioStore((s) => s.toggleCompare);
  const openDetail = useStudioStore((s) => s.openDetail);
  const openRequest = useStudioStore((s) => s.openRequest);
  const saveConfiguration = useStudioStore((s) => s.saveConfiguration);
  const showToast = useStudioStore((s) => s.showToast);
  const resetConfig = useStudioStore((s) => s.resetConfig);

  const [rotating, setRotating] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const vehicle = vehicleById(vehicleId) ?? vehicles[0];
  const estimate = useMemo(() => priceEstimate(config), [config]);
  const empty = isEmptyConfig(config);

  const summaryRows = [
    { label: "Кузов", value: bodyLabel(config) },
    { label: "Диски", value: wheelsLabel(config) },
    { label: "Стёкла", value: glassLabel(config) },
    { label: "Оптика", value: opticsLabel(config) },
    { label: "Салон", value: interiorLabel(config) },
    { label: "Восстановление", value: restorationLabel(config) },
  ];

  return (
    <section className="studio-view">
      <div className="page-heading">
        <div>
          <h1 className="display-heading">Почувствуйте разницу.</h1>
          <p className="page-subtitle">Соберите спецификацию защиты и ухода для вашего автомобиля.</p>
        </div>
        <button className="vehicle-select" onClick={() => setPickerOpen(true)}>
          <span className="vehicle-select-icon"><Icon name="car" size={19} /></span>
          <span className="vehicle-select-copy"><small>АВТОМОБИЛЬ</small><strong>{vehicleTitle(vehicle)}</strong></span>
          <Icon name="chevron" size={14} />
        </button>
      </div>

      {pickerOpen && (
        <div className="inline-picker">
          {vehicles.map((v) => (
            <button key={v.id} className={`inline-picker-item${v.id === vehicle.id ? " is-active" : ""}`} onClick={() => { selectVehicle(v.id); setPickerOpen(false); }}>
              {vehicleTitle(v)}
            </button>
          ))}
          <button className="inline-picker-item" onClick={() => setView("vehicles")}>Все автомобили →</button>
        </div>
      )}

      <div className="studio-grid">
        <div className="studio-stage-col">
          <div className="studio-stage">
            <div className="stage-topline">
              <div className="stage-indicator"><span className="live-dot" /> Живой предпросмотр</div>
              <button className="stage-note" onClick={() => openDetail("model-note")}>
                <Icon name="drop" size={14} /> О модели
              </button>
            </div>

            <div className="stage-canvas-wrap">
              <StudioCanvas vehicle={vehicle} config={config} camera={cameraFor(activeCategory)} rotating={rotating} wheelsGlow={config.wheels !== "none"} />
            </div>

            <div className="stage-bottom">
              <div className="stage-car-title">
                <span className="overline">Текущий образ</span>
                <strong>{vehicleTitle(vehicle)}</strong>
                <span>{bodyLabel(config)} · {finishLabel(config)}</span>
              </div>
              <div className="stage-controls">
                <button className={`stage-control${rotating ? " is-active" : ""}`} title="Повернуть" onClick={() => setRotating((r) => !r)}><Icon name="rotate" size={17} /></button>
                <button className={`stage-control${compareOpen ? " is-active" : ""}`} title="Сравнить" onClick={() => toggleCompare()}><Icon name="compare" size={17} /></button>
                <button className="stage-control" title="Сохранить" onClick={() => { saveConfiguration(); showToast("Сохранено"); }}><Icon name="save" size={17} /></button>
              </div>
            </div>
          </div>

          {compareOpen && <CompareView vehicle={vehicle} config={config} camera={cameraFor(activeCategory)} onClose={() => toggleCompare(false)} />}

          <p className="studio-footnote">
            <span className="footnote-mark">i</span>
            Демонстрационная модель показывает характер материала и финиша, а не точную геометрию выбранного автомобиля.
          </p>
        </div>

        <aside className="studio-panel">
          <div className="category-chip-row">
            {categories.map((c) => (
              <button key={c.id} className={`category-chip${activeCategory === c.id ? " is-active" : ""}`} onClick={() => setCategory(c.id)}>
                {c.chip}
              </button>
            ))}
          </div>

          <div className="category-body card">
            <div className="category-body-head">
              <span className="overline">{categoryById(activeCategory).kicker}</span>
              <h2>{categoryById(activeCategory).title}</h2>
              <p>{categoryById(activeCategory).lede}</p>
            </div>

            <CategoryContent category={activeCategory} />
          </div>

          <div className="summary-card card card-raised">
            <span className="overline">Ваша конфигурация</span>
            {summaryRows.filter((r) => !["Без плёнки", "Без защиты", "Без обработки", "Не требуется"].includes(r.value)).length === 0 ? (
              <p className="summary-empty">Пока ничего не выбрано. Начните с любого направления слева.</p>
            ) : (
              <ul className="summary-list">
                {summaryRows.filter((r) => !["Без плёнки", "Без защиты", "Без обработки", "Не требуется"].includes(r.value)).map((r) => (
                  <li key={r.label}><span>{r.label}</span><strong>{r.value}</strong></li>
                ))}
              </ul>
            )}
            <div className="summary-total"><span>Предварительно</span><strong>{estimate.text}</strong></div>
            <p className="modal-footnote" style={{ margin: "4px 0 12px" }}>{estimate.note}</p>
            <button className="primary-button" style={{ width: "100%" }} disabled={empty} onClick={() => openRequest()}>
              Отправить в UNIQUE
            </button>
            <div className="summary-actions">
              <button className="ghost-button" onClick={() => { saveConfiguration(); showToast("Конфигурация сохранена"); }}>Сохранить</button>
              <button className="ghost-button" onClick={() => { resetConfig(); showToast("Конфигурация сброшена"); }}>Сбросить</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CategoryContent({ category }: { category: CategoryId }) {
  const config = useStudioStore((s) => s.config);
  const updateConfig = useStudioStore((s) => s.updateConfig);
  const openDetail = useStudioStore((s) => s.openDetail);

  if (category === "colour") {
    const selected = config.film.kind === "colour" ? config.film.colourId : null;
    const film = colourById(selected);
    return (
      <>
        <div className="swatch-grid">
          <button
            className={`swatch-card${config.film.kind === "none" ? " is-selected" : ""}`}
            onClick={() => updateConfig({ film: { kind: "none", colourId: null, finish: "gloss" } })}
          >
            <span className="swatch-chip" style={{ background: "repeating-linear-gradient(45deg,#222,#222 4px,#2c2c2c 4px,#2c2c2c 8px)" }} />
            <span className="swatch-index">00</span>
            <span className="swatch-name">Заводской цвет</span>
          </button>
          {colourFilms.map((c) => (
            <button
              key={c.id}
              className={`swatch-card${selected === c.id ? " is-selected" : ""}`}
              onClick={() => updateConfig({ film: { kind: "colour", colourId: c.id, finish: c.finishes[0] } })}
            >
              <span className="swatch-chip" style={{ background: c.shiftHex ? `linear-gradient(135deg, ${c.hex}, ${c.shiftHex})` : c.hex }} />
              <span className="swatch-index">{c.index}</span>
              <span className="swatch-name">{c.name}</span>
            </button>
          ))}
        </div>
        {film && (
          <div className="pill-row" style={{ marginTop: 14 }}>
            {film.finishes.map((f: Finish) => (
              <button key={f} className={`pill${config.film.finish === f ? " is-active" : ""}`} onClick={() => updateConfig({ film: { ...config.film, finish: f } })}>
                {finishLabels[f]}
              </button>
            ))}
          </div>
        )}
        <button className="ghost-button" style={{ marginTop: 10 }} onClick={() => openDetail("colour")}>Подробнее о смене цвета</button>
      </>
    );
  }

  if (category === "ppf") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {ppfOptions.map((o) => (
          <OptionCard
            key={o.id}
            label={o.label}
            detail={o.short}
            price={o.priceFrom ? `от ${o.priceFrom.toLocaleString("ru-RU")} ₽` : undefined}
            selected={config.film.kind === o.id}
            onSelect={() => updateConfig({ film: { kind: o.id, colourId: null, finish: o.id === "matte" ? "matte" : o.id === "satin" ? "satin" : "gloss" } })}
            onInfo={o.id === "none" ? undefined : () => openDetail(`ppf-${o.id}`)}
          />
        ))}
      </div>
    );
  }

  if (category === "ceramic") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        <OptionCard
          label={ceramicBodyOption.label}
          detail={ceramicBodyOption.short}
          price={`от ${ceramicBodyOption.priceFrom!.toLocaleString("ru-RU")} ₽`}
          selected={config.ceramicBody}
          onSelect={() => updateConfig({ ceramicBody: !config.ceramicBody })}
          onInfo={() => openDetail("ceramic")}
        />
        <p className="modal-footnote">Керамика для дисков, стёкол и салона настраивается в соответствующих разделах — «Диски», «Стёкла», «Салон».</p>
      </div>
    );
  }

  if (category === "wheels") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {wheelOptions.map((o) => (
          <OptionCard key={o.id} label={o.label} detail={o.short} selected={config.wheels === o.id} onSelect={() => updateConfig({ wheels: o.id })} onInfo={o.id === "none" ? undefined : () => openDetail("wheels")} />
        ))}
      </div>
    );
  }

  if (category === "glass") {
    return (
      <>
        <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
          {glassOptions.map((o) => (
            <OptionCard key={o.id} label={o.label} detail={o.short} selected={config.glass === o.id} onSelect={() => updateConfig({ glass: o.id })} onInfo={o.id === "none" ? undefined : () => openDetail("glass")} />
          ))}
        </div>
        <span className="overline">Тонирование</span>
        <div className="pill-row" style={{ marginTop: 8 }}>
          {tintOptions.map((o) => (
            <button key={o.id} className={`pill${config.tint === o.id ? " is-active" : ""}`} onClick={() => updateConfig({ tint: o.id })}>{o.label}</button>
          ))}
        </div>
      </>
    );
  }

  if (category === "optics") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {opticsOptions.map((o) => (
          <OptionCard key={o.id} label={o.label} detail={o.short} price={o.priceFrom ? `от ${o.priceFrom.toLocaleString("ru-RU")} ₽` : undefined} selected={config.optics === o.id} onSelect={() => updateConfig({ optics: o.id })} onInfo={o.id === "none" ? undefined : () => openDetail("optics")} />
        ))}
      </div>
    );
  }

  if (category === "interior") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {interiorOptions.map((o) => (
          <OptionCard key={o.id} label={o.label} detail={o.short} price={o.priceFrom ? `от ${o.priceFrom.toLocaleString("ru-RU")} ₽` : undefined} selected={config.interior === o.id} onSelect={() => updateConfig({ interior: o.id })} onInfo={o.id === "none" ? undefined : () => openDetail("interior")} />
        ))}
      </div>
    );
  }

  if (category === "restoration") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {restorationOptions.map((o) => (
          <OptionCard key={o.id} label={o.label} detail={o.short} selected={config.restoration === o.id} onSelect={() => updateConfig({ restoration: o.id })} onInfo={o.id === "none" ? undefined : () => openDetail("restoration")} />
        ))}
        <p className="modal-footnote">Используйте кнопку сравнения на панели студии, чтобы увидеть образ «до / после».</p>
      </div>
    );
  }

  // bespoke — editorial read-only spec of everything chosen so far
  const items: { n: string; label: string; value: string }[] = [
    { n: "01", label: "Кузов", value: bodyLabel(config) },
    { n: "02", label: "Диски", value: wheelsLabel(config) },
    { n: "03", label: "Стёкла", value: glassLabel(config) },
    { n: "04", label: "Оптика", value: opticsLabel(config) },
    { n: "05", label: "Салон", value: interiorLabel(config) },
    { n: "06", label: "Восстановление", value: restorationLabel(config) },
  ];
  return (
    <div className="bespoke-list">
      {items.map((it) => (
        <div className="bespoke-row" key={it.n}>
          <span className="bespoke-index">{it.n}</span>
          <div>
            <span className="overline">{it.label}</span>
            <strong>{it.value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}
