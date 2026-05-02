import { DataGridCellProps } from "../types"
import { CurrencyInfo } from "../../../lib/data/currencies"
import { useQuantityPrice } from "../../../routes/price-lists/common/components/quantity-price-provider/use-quantity-price"
import { TieredPriceCell } from "../../table/table-cells/common/tiered-price-cell/tiered-price-cell"

interface DataGridQuantityPriceCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  code: string
}

export const DataGridQuantityPriceCell = <TData, TValue = any>({
  context,
  code,
}: DataGridQuantityPriceCellProps<TData, TValue>) => {
  const { onOpenQuantityPricesModal } = useQuantityPrice()

  const handleOpenModal = (field: string, currency: CurrencyInfo) =>
    onOpenQuantityPricesModal({
      field,
      name: "Quantity Price",
      currency,
    })

  return (
    <TieredPriceCell
      context={context}
      code={code}
      getTieredFieldName={(field) => {
        return field
          .replace("currency_prices", "conditional_currency_prices")
          .replace("region_prices", "conditional_region_prices")
          .replace(/\.0\.amount$/, "")
      }}
      onOpenModal={handleOpenModal}
    />
  )
}
