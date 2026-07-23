import { create } from "zustand";

interface SearchState {
  isSearchOpen: boolean;
  query: string;
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isSearchOpen: false,
  query: "",
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, query: "" }),
  setQuery: (query) => set({ query }),
}));
