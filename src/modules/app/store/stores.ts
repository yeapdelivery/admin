import { create } from "zustand";
import StoreModel from "../models/store";

interface Store {
  store: StoreModel;
  setStore: (settings: Partial<StoreModel>) => void;
  clearStore: () => void;
}

export const useStore = create<Store>((set) => ({
  store: {} as StoreModel,
  setStore: (settings) =>
    set((state) => ({
      store: {
        ...state.store,
        ...settings,
      },
    })),
  clearStore: () =>
    set(() => ({
      store: {} as StoreModel,
    })),
}));
