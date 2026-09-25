/**
 * Domain models for UNIQUE Visual Studio.
 * ConfigState/VisualConfiguration mirror the shape the UNIQUE CRM is expected
 * to consume later (see brief §29 / §61-62): 3D state, configuration state,
 * and customer/UI state are kept separate on purpose.
 */

export type Finish = "gloss" | "satin" | "matte" | "shift";
export type FilmKind = "none" | "clear" | "satin" | "matte" | "colour";
export type WheelTreatment = "none" | "ceramic" | "calipers" | "arches";
export type GlassTreatment = "none" | "hydro" | "windshield" | "full";
export type TintTreatment = "none" | "light" | "dark";
export type OpticsTreatment = "none" | "clear" | "head" | "tail" | "full";
export type InteriorTreatment = "none" | "coat" | "leather" | "alcantara" | "clean";
export type RestorationTreatment = "none" | "correction" | "gloss";
export type BodyType = "coupe" | "sedan" | "gt" | "suv";
export type CameraPreset = "hero" | "threeQuarterFront" | "threeQuarterRear" | "front" | "rear" | "side" | "top" | "detail" | "interior";

/** Everything the client has configured on the vehicle. Independent of 3D/UI state. */
export interface ConfigState {
  vehicleId: string;
  film: { kind: FilmKind; colourId: string | null; finish: Finish };
  ceramicBody: boolean;
  wheels: WheelTreatment;
  glass: GlassTreatment;
  tint: TintTreatment;
  optics: OpticsTreatment;
  interior: InteriorTreatment;
  restoration: RestorationTreatment;
}

export type CategoryId = "colour" | "ppf" | "ceramic" | "wheels" | "glass" | "optics" | "interior" | "restoration" | "bespoke";
export type ConfigStatus = "draft" | "saved" | "submitted" | "reviewed" | "quoted";

export interface CustomerInfo {
  name?: string;
  phone?: string;
  email?: string;
}

/** CRM-ready payload (brief §29). */
export interface VisualConfiguration {
  id: string;
  createdAt: string;
  customer?: CustomerInfo;
  vehicle: { brand: string; model: string; generation?: string; colour?: string };
  treatments: {
    body?: string;
    finish?: string;
    wheels?: string;
    glass?: string;
    optics?: string;
    interior?: string;
    restoration?: string;
  };
  estimatedPrice?: number;
  notes?: string;
  previewImages?: string[];
  status: ConfigStatus;
}

export interface SavedConfiguration {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ConfigStatus;
  config: ConfigState;
  vehicleTitle: string;
  estimateText: string;
  notes?: string;
  customer?: CustomerInfo;
}

export interface VehicleDef {
  id: string;
  brand: string;
  model: string;
  bodyType: BodyType;
  /** Whether a (procedural, placeholder) 3D model is available for this prototype */
  has3d: boolean;
  basePaint: string;
  /**
   * Optional path to a real GLB/GLTF model, e.g. "/models/porsche-911.glb".
   * Drop a file at public/models/<file>.glb and set this field to switch that
   * vehicle from the procedural placeholder to the real mesh — no other code
   * changes needed. See README "Adding real car models" for mesh-naming rules
   * (body_*, glass_*, wheel_*, trim_*) so paint/wrap/tint still drive the mesh.
   */
  modelUrl?: string;
}

export interface ClientVehicle {
  id: string;
  vehicleId: string | null;
  brand: string;
  model: string;
  plate?: string;
  protection: string;
  lastRevision?: string;
  demo?: boolean;
}
