import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryId, ClientVehicle, ConfigState, CustomerInfo, SavedConfiguration } from "../domain/types";
import { emptyConfig, priceEstimate } from "../data/treatments";
import { vehicleTitle, vehicles } from "../data/vehicles";

export type ViewId = "welcome" | "vehicles" | "studio" | "saved" | "profile";

/** Kept separate from configuration state on purpose (brief §62). */
interface UiSlice {
  view: ViewId;
  activeCategory: CategoryId;
  compareOpen: boolean;
  sheetCategory: CategoryId | null; // mobile bottom-sheet
  detailKey: string | null; // service info sheet
  requestOpen: boolean;
  toast: string | null;
}

interface StudioState extends UiSlice {
  vehicleId: string | null;
  config: ConfigState;
  savedConfigurations: SavedConfiguration[];
  myVehicles: ClientVehicle[];
  customer: CustomerInfo;

  setView: (v: ViewId) => void;
  selectVehicle: (id: string) => void;
  setCategory: (c: CategoryId) => void;
  openSheet: (c: CategoryId | null) => void;
  openDetail: (key: string | null) => void;
  toggleCompare: (open?: boolean) => void;
  openRequest: (open?: boolean) => void;
  updateConfig: (patch: Partial<ConfigState> | ((c: ConfigState) => ConfigState)) => void;
  resetConfig: () => void;
  saveConfiguration: () => string;
  deleteConfiguration: (id: string) => void;
  loadConfiguration: (id: string) => void;
  submitRequest: (customer: CustomerInfo, notes: string) => string;
  setCustomer: (c: CustomerInfo) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

const genId = () => Math.random().toString(36).slice(2, 10);
const configId = () => `UQ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      view: "welcome",
      activeCategory: "colour",
      compareOpen: false,
      sheetCategory: null,
      detailKey: null,
      requestOpen: false,
      toast: null,

      vehicleId: null,
      config: emptyConfig(vehicles[0].id),
      savedConfigurations: [],
      myVehicles: [
        { id: "cv-1", vehicleId: "porsche-911", brand: "Porsche", model: "911 Carrera 4 GTS", protection: "UNIQUE PPF Satin", lastRevision: "12.09.2026", demo: true },
      ],
      customer: {},

      setView: (v) => set({ view: v }),
      selectVehicle: (id) => set({ vehicleId: id, config: emptyConfig(id), view: "studio", activeCategory: "colour" }),
      setCategory: (c) => set({ activeCategory: c }),
      openSheet: (c) => set({ sheetCategory: c }),
      openDetail: (key) => set({ detailKey: key }),
      toggleCompare: (open) => set((s) => ({ compareOpen: open ?? !s.compareOpen })),
      openRequest: (open) => set({ requestOpen: open ?? true }),
      updateConfig: (patch) =>
        set((s) => ({ config: typeof patch === "function" ? patch(s.config) : { ...s.config, ...patch } })),
      resetConfig: () => set((s) => ({ config: emptyConfig(s.vehicleId ?? vehicles[0].id) })),

      saveConfiguration: () => {
        const s = get();
        const v = vehicles.find((x) => x.id === s.vehicleId) ?? vehicles[0];
        const id = configId();
        const now = new Date().toISOString();
        const est = priceEstimate(s.config);
        const item: SavedConfiguration = {
          id,
          createdAt: now,
          updatedAt: now,
          status: "saved",
          config: s.config,
          vehicleTitle: vehicleTitle(v),
          estimateText: est.text,
        };
        set({ savedConfigurations: [item, ...s.savedConfigurations] });
        return id;
      },
      deleteConfiguration: (id) => set((s) => ({ savedConfigurations: s.savedConfigurations.filter((c) => c.id !== id) })),
      loadConfiguration: (id) => {
        const item = get().savedConfigurations.find((c) => c.id === id);
        if (!item) return;
        set({ config: item.config, vehicleId: item.config.vehicleId, view: "studio" });
      },
      submitRequest: (customer, notes) => {
        const s = get();
        const v = vehicles.find((x) => x.id === s.vehicleId) ?? vehicles[0];
        const id = configId();
        const now = new Date().toISOString();
        const est = priceEstimate(s.config);
        const item: SavedConfiguration = {
          id,
          createdAt: now,
          updatedAt: now,
          status: "submitted",
          config: s.config,
          vehicleTitle: vehicleTitle(v),
          estimateText: est.text,
          notes,
          customer,
        };
        set({ savedConfigurations: [item, ...s.savedConfigurations], customer, requestOpen: false });
        return id;
      },
      setCustomer: (c) => set({ customer: c }),
      showToast: (msg) => set({ toast: msg }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: "unique.visualStudio.v2",
      partialize: (s) => ({
        vehicleId: s.vehicleId,
        config: s.config,
        savedConfigurations: s.savedConfigurations,
        myVehicles: s.myVehicles,
        customer: s.customer,
      }),
    },
  ),
);

export const genRequestId = genId;
