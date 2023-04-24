import { Store } from "@medusajs/medusa/dist/models"
import create from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface UserStore {
  selectedStore: Store | null
  setSelectedStore: (setSelectedStore: Store) => void
}

const userStore = (set) => ({
  selectedStore: { id: "all" },
  setSelectedStore: (selectedStore) =>
    set((state) => ({ ...state, selectedStore })),
})

export const useUserSettings = create(
  devtools(persist(userStore, { name: "user_settings" }))
)
