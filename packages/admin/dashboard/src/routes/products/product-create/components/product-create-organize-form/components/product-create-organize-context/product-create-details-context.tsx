import { createContext } from "react"

type ProductCreateDetailsContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProductCreateDetailsContext =
  createContext<ProductCreateDetailsContextValue | null>(null)
