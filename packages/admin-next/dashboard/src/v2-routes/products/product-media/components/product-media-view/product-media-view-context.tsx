import { createContext } from "react"

type ProductMediaViewContextValue = {
  goToGallery: () => void
  goToEdit: () => void
}

export const ProductMediaViewContext =
  createContext<ProductMediaViewContextValue | null>(null)
