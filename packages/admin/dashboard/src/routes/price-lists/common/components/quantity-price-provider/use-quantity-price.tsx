import { useContext } from "react"
import { QuantityPriceContext } from "./quantity-price-context"

export const useQuantityPrice = () => {
  const context = useContext(QuantityPriceContext)

  if (!context) {
    throw new Error(
      "useQuantityPrice must be used within a QuantityPriceProvider"
    )
  }

  return context
}
