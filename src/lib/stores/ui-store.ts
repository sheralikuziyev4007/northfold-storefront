import { create } from 'zustand';

type Toast = { id: number; message: string; action?: { label: string; onAction: () => void } };

type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toast: Toast | null;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  showToast: (message: string, action?: Toast['action']) => void;
  dismissToast: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toast: null,
  openCart: () => set({ cartOpen: true, searchOpen: false, menuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true, cartOpen: false, menuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),
  showToast: (message, action) => set({ toast: { id: Date.now(), message, action } }),
  dismissToast: () => set({ toast: null }),
}));
