import { create } from "zustand";
import { Product } from "@/types";

interface QuickViewState {
  selectedProduct: Product | null;
  isQuickViewOpen: boolean;
  isSizeGuideOpen: boolean;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
  selectedProduct: null,
  isQuickViewOpen: false,
  isSizeGuideOpen: false,

  openQuickView: (product) => set({ selectedProduct: product, isQuickViewOpen: true }),
  closeQuickView: () => set({ isQuickViewOpen: false }),

  openSizeGuide: () => set({ isSizeGuideOpen: true }),
  closeSizeGuide: () => set({ isSizeGuideOpen: false }),
}));
