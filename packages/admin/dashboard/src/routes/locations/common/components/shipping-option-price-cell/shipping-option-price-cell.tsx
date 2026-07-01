import { DataGridCellProps } from "../../../../../components/data-grid/types"
import { getCustomShippingOptionPriceFieldName } from "../../utils/get-custom-shipping-option-price-field-info"
import { useShippingOptionPrice } from "../shipping-option-price-provider"
import { TieredPriceCell } from "../../../../../components/table/table-cells/common/tiered-price-cell/tiered-price-cell"

interface ShippingOptionPriceCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  code: string
  header: string
  type: "currency" | "region"
}

export const ShippingOptionPriceCell = <TData, TValue = any>({
  context,
  code,
  header,
  type,
}: ShippingOptionPriceCellProps<TData, TValue>) => {
  const { onOpenConditionalPricesModal } = useShippingOptionPrice()

  return (
    <TieredPriceCell
      context={context}
      code={code}
      getTieredFieldName={(field) =>
        getCustomShippingOptionPriceFieldName(field, type)
      }
      onOpenModal={(field, currency) =>
        onOpenConditionalPricesModal({
          type,
          field,
          currency,
          name: header,
        })
      }
    />
  )
}
