import { createContext } from "react"
import { QuantityPriceInfo } from "../../types"

type QuantityPriceContextType = {
  onOpenQuantityPricesModal: (info: QuantityPriceInfo) => void
  onCloseQuantityPricesModal: () => void
}

export const QuantityPriceContext =
  createContext<QuantityPriceContextType | null>(null)
