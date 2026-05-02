import { QuantityPriceContext } from "./quantity-price-context"

import { PropsWithChildren } from "react"
import { QuantityPriceInfo } from "../../types"

type QuantityPriceProviderProps = PropsWithChildren<{
  onOpenQuantityPricesModal: (info: QuantityPriceInfo) => void
  onCloseQuantityPricesModal: () => void
}>

export const QuantityPriceProvider = ({
  children,
  onOpenQuantityPricesModal,
  onCloseQuantityPricesModal,
}: QuantityPriceProviderProps) => {
  return (
    <QuantityPriceContext.Provider
      value={{ onOpenQuantityPricesModal, onCloseQuantityPricesModal }}
    >
      {children}
    </QuantityPriceContext.Provider>
  )
}
