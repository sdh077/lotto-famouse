// src/stores/Filter-store.ts
import { createStore } from 'zustand/vanilla'

export type FilterState = {
  address1: string;
  address2: string;
}

export type FilterActions = {
  setAddress: (address1: string, address2: string) => void;
}

export type FilterStore = FilterState & FilterActions

export const defaultInitState: FilterState = {
  address1: '서울',
  address2: ''
}

export const createFilterStore = (
  initState: FilterState = defaultInitState,
) => {
  return createStore<FilterStore>()((set) => ({
    ...initState,
    setAddress: (address1: string, address2: string) =>
      set((state) => ({ ...state, address1, address2 })),
  }))
}
