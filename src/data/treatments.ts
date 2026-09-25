import type {
  CategoryId,
  ConfigState,
  FilmKind,
  Finish,
  GlassTreatment,
  InteriorTreatment,
  OpticsTreatment,
  RestorationTreatment,
  TintTreatment,
  WheelTreatment,
} from "../domain/types";

/**
 * Central UNIQUE service catalogue (brief §38).
 * The CRM and this client app are meant to eventually share this file.
 * `priceFrom: null` renders as "по расчёту после осмотра" — never invented.
 */
export interface TreatmentOption<T extends string = string> {
  id: T;
  label: string;
  short: string;
  priceFrom: number | null;
}

export interface ServiceDetail {
  overline: string;
  title: string;
  lede: string;
  protectsFrom?: string[];
  facts: { label: string; value: string }[];
  disclaimer?: string;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  chip: string;
  kicker: string;
  title: string;
  lede: string;
  icon: string;
  camera: string;
}

export const categories: CategoryDef[] = [
  { id: "colour", label: "Смена цвета", chip: "Цвет", kicker: "Цветной полиуретан", title: "Смена цвета", lede: "Цветная плёнка поверх заводского покрытия — обратимо, без окраски.", icon: "swatch", camera: "threeQuarterFront" },
  { id: "ppf", label: "Защита кузова", chip: "Плёнка", kicker: "Плёнка UNIQUE", title: "Защита кузова", lede: "Полиуретановая защита без разборки: Clear, Satin, Matte.", icon: "shield", camera: "threeQuarterFront" },
  { id: "ceramic", label: "Керамическая защита", chip: "Керамика", kicker: "Глубокая защита", title: "Керамическая защита", lede: "Керамика 9H для кузова, дисков, стёкол и салона.", icon: "drop", camera: "threeQuarterFront" },
  { id: "wheels", label: "Колёсные диски", chip: "Диски", kicker: "Колёса", title: "Колёсные диски", lede: "Защита дисков и прилегающих зон колеса.", icon: "wheel", camera: "detail" },
  { id: "glass", label: "Стёкла", chip: "Стёкла", kicker: "Стёкла", title: "Стёкла", lede: "Гидрофобная защита и тонирование.", icon: "glass", camera: "threeQuarterFront" },
  { id: "optics", label: "Оптика", chip: "Оптика", kicker: "Фары и задняя оптика", title: "Оптика", lede: "Прозрачная плёнка защищает оптику от сколов и абразива.", icon: "light", camera: "front" },
  { id: "interior", label: "Салон", chip: "Салон", kicker: "Салон", title: "Салон", lede: "Кожа, Alcantara и глубокая чистка.", icon: "seat", camera: "interior" },
  { id: "restoration", label: "Восстановление", chip: "Ремонт", kicker: "Восстановление", title: "Восстановление и полировка", lede: "Коррекция покрытия перед защитой.", icon: "sparkle", camera: "threeQuarterRear" },
  { id: "bespoke", label: "BESPOKE", chip: "BESPOKE", kicker: "Ваша спецификация", title: "BESPOKE", lede: "Соберите собственную спецификацию — каждая позиция обновляет автомобиль и итог.", icon: "spec", camera: "threeQuarterFront" },
];
export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;

export const ppfOptions: TreatmentOption<Exclude<FilmKind, "colour">>[] = [
  { id: "none", label: "Без плёнки", short: "Заводское покрытие", priceFrom: null },
  { id: "clear", label: "UNIQUE PPF Clear", short: "Прозрачная защита кузова", priceFrom: 180000 },
  { id: "satin", label: "UNIQUE PPF Satin", short: "Сатиновый образ", priceFrom: 180000 },
  { id: "matte", label: "UNIQUE PPF Matte", short: "Матовый образ", priceFrom: 180000 },
];

export interface ColourFilm {
  id: string;
  index: string;
  name: string;
  hex: string;
  finishes: Finish[];
  shiftHex?: string;
}
export const colourFilms: ColourFilm[] = [
  { id: "black", index: "01", name: "Чёрный", hex: "#0c0c0e", finishes: ["gloss", "satin", "matte"] },
  { id: "graphite", index: "02", name: "Графит", hex: "#3b3d43", finishes: ["gloss", "satin", "matte"] },
  { id: "silver", index: "03", name: "Серебро", hex: "#a3a7ad", finishes: ["gloss", "satin", "matte"] },
  { id: "deep-blue", index: "04", name: "Глубокий синий", hex: "#14284a", finishes: ["gloss", "satin", "matte"] },
  { id: "racing-green", index: "05", name: "Британский зелёный", hex: "#123a2c", finishes: ["gloss", "satin", "matte"] },
  { id: "burgundy", index: "06", name: "Бургунди", hex: "#4f1420", finishes: ["gloss", "satin", "matte"] },
  { id: "pearl", index: "07", name: "Жемчуг", hex: "#e6e2d8", finishes: ["gloss", "satin"] },
  { id: "shift", index: "08", name: "Colour Shift", hex: "#22304d", finishes: ["shift"], shiftHex: "#5b2a7a" },
];
export const colourById = (id: string | null) => colourFilms.find((c) => c.id === id) ?? null;
export const finishLabels: Record<Finish, string> = { gloss: "Глянец", satin: "Сатин", matte: "Матовый", shift: "Colour Shift" };

export const wheelOptions: TreatmentOption<WheelTreatment>[] = [
  { id: "none", label: "Без защиты", short: "Текущее состояние дисков", priceFrom: null },
  { id: "ceramic", label: "Wheel Ceramic 9H", short: "Керамика на лицевой поверхности дисков", priceFrom: null },
  { id: "calipers", label: "Керамика + суппорта", short: "Диски и тормозные суппорта", priceFrom: null },
  { id: "arches", label: "Диски + арки", short: "Диски и колёсные арки", priceFrom: null },
];
export const glassOptions: TreatmentOption<GlassTreatment>[] = [
  { id: "none", label: "Без защиты", short: "Стёкла без обработки", priceFrom: null },
  { id: "hydro", label: "Гидрофобное покрытие", short: "Боковые и задние стёкла", priceFrom: null },
  { id: "windshield", label: "Переднее стекло", short: "Лобовое стекло", priceFrom: null },
  { id: "full", label: "Полный пакет", short: "Все стёкла автомобиля", priceFrom: null },
];
export const tintOptions: TreatmentOption<TintTreatment>[] = [
  { id: "none", label: "Без тонировки", short: "Стёкла без плёнки", priceFrom: null },
  { id: "light", label: "Светлая", short: "Мягкое затемнение", priceFrom: 25000 },
  { id: "dark", label: "Тёмная", short: "Глубокое затемнение", priceFrom: 25000 },
];
export const opticsOptions: TreatmentOption<OpticsTreatment>[] = [
  { id: "none", label: "Без защиты", short: "Оптика без плёнки", priceFrom: null },
  { id: "clear", label: "UNIQUE PPF Clear", short: "Передняя оптика", priceFrom: 25000 },
  { id: "head", label: "Фары", short: "Только передняя оптика", priceFrom: 25000 },
  { id: "tail", label: "Задняя оптика", short: "Только задние фонари", priceFrom: 25000 },
  { id: "full", label: "Полный пакет", short: "Передняя и задняя оптика", priceFrom: 25000 },
];
export const interiorOptions: TreatmentOption<InteriorTreatment>[] = [
  { id: "none", label: "Без обработки", short: "Салон без изменений", priceFrom: null },
  { id: "coat", label: "UNIQUE Interior Coat", short: "Защитное покрытие материалов салона", priceFrom: null },
  { id: "leather", label: "Защита кожи", short: "Кожаные поверхности", priceFrom: null },
  { id: "alcantara", label: "Alcantara", short: "Чистка и защита Alcantara", priceFrom: null },
  { id: "clean", label: "Комплексная химчистка", short: "Кожа, Alcantara, ткань, потолок", priceFrom: 45000 },
];
export const restorationOptions: TreatmentOption<RestorationTreatment>[] = [
  { id: "none", label: "Не требуется", short: "Покрытие без коррекции", priceFrom: null },
  { id: "correction", label: "Коррекция покрытия", short: "Устранение микроповреждений", priceFrom: null },
  { id: "gloss", label: "Восстановление блеска", short: "Полировка + защита", priceFrom: null },
];
export const ceramicBodyOption: TreatmentOption = { id: "body", label: "Керамика 9H · кузов", short: "Керамическая защита лакокрасочного покрытия", priceFrom: 90000 };

export const serviceDetails: Record<string, ServiceDetail> = {
  "ppf-clear": { overline: "PPF", title: "UNIQUE PPF Clear", lede: "Прозрачная защитная плёнка для сохранения заводского покрытия. Устанавливается без разборки.", protectsFrom: ["сколов", "царапин", "реагентов", "песка"], facts: [{ label: "Финиш", value: "Глянец" }, { label: "Свойства", value: "Эффект самовосстановления" }, { label: "Гарантия", value: "10 лет" }] },
  "ppf-satin": { overline: "PPF", title: "UNIQUE PPF Satin", lede: "Защитная плёнка с деликатным сатиновым эффектом.", protectsFrom: ["сколов", "царапин", "реагентов", "песка"], facts: [{ label: "Финиш", value: "Сатин" }, { label: "Свойства", value: "Эффект самовосстановления" }, { label: "Гарантия", value: "10 лет" }] },
  "ppf-matte": { overline: "PPF", title: "UNIQUE PPF Matte", lede: "Матовый образ автомобиля с защитой лакокрасочного покрытия.", protectsFrom: ["сколов", "царапин", "реагентов", "песка"], facts: [{ label: "Финиш", value: "Матовый" }, { label: "Свойства", value: "Эффект самовосстановления" }, { label: "Гарантия", value: "10 лет" }] },
  colour: { overline: "Смена цвета", title: "Цветной полиуретан UNIQUE", lede: "Меняет цвет и фактуру автомобиля, не затрагивая заводское покрытие.", facts: [{ label: "Палитра", value: "80+ цветов" }, { label: "Финиши", value: "Глянец · Сатин · Матовый · Colour Shift" }, { label: "Обратимость", value: "Плёнка снимается" }], disclaimer: "В прототипе показана подборка оттенков, а не вся палитра UNIQUE." },
  ceramic: { overline: "Керамика", title: "Керамическая защита 9H", lede: "Керамика для кузова, колёсных дисков, стёкол и кожи салона.", facts: [{ label: "Твёрдость", value: "9H" }, { label: "Поверхности", value: "Кузов · диски · стёкла · салон" }, { label: "Срок действия", value: "До 5 лет" }] },
  wheels: { overline: "Диски", title: "Wheel Ceramic 9H", lede: "Керамическое покрытие лицевой поверхности дисков облегчает уход и защищает от реагентов.", facts: [{ label: "Защита", value: "Диски · суппорта · арки" }, { label: "Твёрдость", value: "9H" }, { label: "Срок действия", value: "До 5 лет" }] },
  glass: { overline: "Стёкла", title: "Гидрофобная защита стёкол", lede: "Вода собирается в капли и скатывается со стекла — видимость в дождь лучше.", facts: [{ label: "Эффект", value: "Гидрофобность" }, { label: "Зоны", value: "Лобовое · боковые · задние" }] },
  tint: { overline: "Стёкла", title: "Тонирование стёкол", lede: "Плёнка для комфорта и приватности салона в рамках требований к прозрачности.", facts: [{ label: "Пакет", value: "Тонирование + оптика" }, { label: "От", value: "25 000 ₽" }] },
  optics: { overline: "Оптика", title: "Защита оптики", lede: "Прозрачная плёнка UNIQUE на фарах и фонарях защищает пластик и стекло, не меняя внешний вид.", protectsFrom: ["сколов", "песка", "абразивного износа"], facts: [{ label: "Финиш", value: "Прозрачный" }, { label: "Гарантия", value: "10 лет" }] },
  interior: { overline: "Салон", title: "UNIQUE Interior Coat", lede: "Защитное покрытие для кожи и других материалов салона.", facts: [{ label: "Материалы", value: "Кожа · Alcantara · ткань" }, { label: "Химчистка", value: "От 45 000 ₽" }] },
  restoration: { overline: "Восстановление", title: "Восстановление и защита", lede: "Коррекция лакокрасочного покрытия и восстановление блеска перед установкой защиты.", facts: [{ label: "Этапы", value: "Осмотр · коррекция · защита" }, { label: "Стоимость", value: "После осмотра" }], disclaimer: "Сравнение носит иллюстративный характер и не обещает результат по конкретным повреждениям." },
};

export const emptyConfig = (vehicleId: string): ConfigState => ({
  vehicleId,
  film: { kind: "none", colourId: null, finish: "gloss" },
  ceramicBody: false,
  wheels: "none",
  glass: "none",
  tint: "none",
  optics: "none",
  interior: "none",
  restoration: "none",
});

export const bodyLabel = (c: ConfigState): string => {
  if (c.film.kind === "clear") return "UNIQUE PPF Clear";
  if (c.film.kind === "satin") return "UNIQUE PPF Satin";
  if (c.film.kind === "matte") return "UNIQUE PPF Matte";
  if (c.film.kind === "colour") {
    const col = colourById(c.film.colourId);
    if (col?.id === "shift") return "UNIQUE PPF Colour Shift";
    return col ? `Цветной полиуретан · ${col.name}` : "Цветной полиуретан";
  }
  return "Без плёнки";
};
export const finishLabel = (c: ConfigState): string => {
  if (c.film.kind === "clear") return finishLabels.gloss;
  if (c.film.kind === "satin") return finishLabels.satin;
  if (c.film.kind === "matte") return finishLabels.matte;
  if (c.film.kind === "colour") return finishLabels[c.film.finish];
  return finishLabels.gloss;
};
const labelOf = <T extends string>(list: TreatmentOption<T>[], id: T) => list.find((o) => o.id === id)?.label ?? "";
export const wheelsLabel = (c: ConfigState) => labelOf(wheelOptions, c.wheels);
export const glassLabel = (c: ConfigState) => {
  const parts = [c.glass !== "none" ? labelOf(glassOptions, c.glass) : "", c.tint !== "none" ? `Тонировка · ${labelOf(tintOptions, c.tint).toLowerCase()}` : ""].filter(Boolean);
  return parts.join(" + ") || "Без защиты";
};
export const opticsLabel = (c: ConfigState) => (c.optics === "none" ? "Без защиты" : c.optics === "clear" ? "UNIQUE PPF Clear" : `UNIQUE PPF Clear · ${labelOf(opticsOptions, c.optics).toLowerCase()}`);
export const interiorLabel = (c: ConfigState) => labelOf(interiorOptions, c.interior);
export const restorationLabel = (c: ConfigState) => labelOf(restorationOptions, c.restoration);
export const isEmptyConfig = (c: ConfigState) =>
  c.film.kind === "none" && !c.ceramicBody && c.wheels === "none" && c.glass === "none" && c.tint === "none" && c.optics === "none" && c.interior === "none" && c.restoration === "none";

export const priceEstimate = (c: ConfigState): { text: string; note: string } => {
  const floors: number[] = [];
  const unpriced: string[] = [];
  if (c.film.kind !== "none" && c.film.kind !== "colour") floors.push(180000);
  if (c.film.kind === "colour") floors.push(colourById(c.film.colourId)?.id === "shift" ? 320000 : 320000);
  if (c.ceramicBody) floors.push(90000);
  if (c.wheels !== "none") unpriced.push("Колёсные диски");
  if (c.glass !== "none") unpriced.push("Стёкла");
  if (c.tint !== "none") floors.push(25000);
  if (c.optics !== "none") floors.push(25000);
  if (c.interior === "clean") floors.push(45000);
  else if (c.interior !== "none") unpriced.push("Салон");
  if (c.restoration !== "none") unpriced.push("Восстановление");

  const amount = floors.reduce((a, b) => a + b, 0);
  const formatted = amount.toLocaleString("ru-RU");
  if (!amount && !unpriced.length) return { text: "—", note: "Выберите направление, чтобы увидеть ориентир." };
  if (!amount) return { text: "по расчёту", note: "Точная стоимость — после осмотра автомобиля." };
  if (unpriced.length) return { text: `от ${formatted} ₽*`, note: "Суммированы опубликованные ориентиры. Остальные позиции — после осмотра." };
  return { text: `от ${formatted} ₽`, note: "Ориентир на основе опубликованных цен UNIQUE. Точная стоимость — после осмотра." };
};
