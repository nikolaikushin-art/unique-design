import type { VehicleDef } from "../domain/types";

/**
 * Controlled prototype dataset (brief §9-10). Six vehicles, all sharing the
 * same procedural placeholder geometry (see three/CarModel.tsx) — every
 * vehicle here is explicitly `has3d: true` only in the sense that the studio
 * can render *a* body for it; there is no licensed brand-accurate mesh.
 */
export const vehicles: VehicleDef[] = [
  { id: "porsche-911", brand: "Porsche", model: "911", bodyType: "coupe", has3d: true, basePaint: "#c7c9cc" },
  { id: "bmw-m3", brand: "BMW", model: "M3 Competition", bodyType: "sedan", has3d: true, basePaint: "#1c2c46" },
  { id: "amg-gt", brand: "Mercedes-AMG", model: "GT", bodyType: "coupe", has3d: true, basePaint: "#101114" },
  { id: "bentayga", brand: "Bentley", model: "Bentayga", bodyType: "suv", has3d: true, basePaint: "#2c2f33" },
  { id: "range-rover", brand: "Range Rover", model: "Range Rover", bodyType: "suv", has3d: true, basePaint: "#0e1013" },
  { id: "urus", brand: "Lamborghini", model: "Urus", bodyType: "suv", has3d: true, basePaint: "#5a6b52" },
];

export const vehicleById = (id: string | null) => vehicles.find((v) => v.id === id) ?? null;
export const vehicleTitle = (v: VehicleDef) => `${v.brand} ${v.model}`;
