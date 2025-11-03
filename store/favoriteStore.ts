import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Technician {
  id: number;
  name: string;
  category: string;
  location: string;
  image: string;
}

interface FavoriteStore {
  favorites: Technician[];
  toggleFavorite: (technician: Technician) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (technician) => {
        const { favorites } = get();
        const exists = favorites.find((t) => t.id === technician.id);
        if (exists) {
          set({
            favorites: favorites.filter((t) => t.id !== technician.id),
          });
        } else {
          set({ favorites: [...favorites, technician] });
        }
      },

      isFavorite: (id) => {
        return get().favorites.some((t) => t.id === id);
      },
    }),
    {
      name: "favorites-storage", // nama key untuk local storage
    }
  )
);
