import { DataGridCellProps } from "../types"
import { CurrencyInfo } from "../../../lib/data/currencies"
import { useTranslation } from "react-i18next"
import { useQuantityPrice } from "../../../routes/price-lists/common/components/quantity-price-provider/use-quantity-price"
import { TieredPriceCell } from "../../table/table-cells/common/tiered-price-cell/tiered-price-cell"

interface DataGridQuantityPriceCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  code: string
  getTieredFieldName: (field: string) => string
}

export const DataGridQuantityPriceCell = <TData, TValue = any>({
  context,
  code,
  getTieredFieldName,
}: DataGridQuantityPriceCellProps<TData, TValue>) => {
  const { t } = useTranslation()
  const { onOpenQuantityPricesModal } = useQuantityPrice()

  const handleOpenModal = (field: string, currency: CurrencyInfo) =>
    onOpenQuantityPricesModal({
      field,
      name: t("general.quantityPrice"),
      currency,
    })

  return (
    <TieredPriceCell
      context={context}
      code={code}
      getTieredFieldName={getTieredFieldName}
      onOpenModal={handleOpenModal}
    />
  )
}
