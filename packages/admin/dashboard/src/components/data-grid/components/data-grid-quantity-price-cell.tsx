import { DataGridCurrencyCell } from "./data-grid-currency-cell"
import { DataGridCellProps } from "../types"
import { ArrowsPointingOut } from "@medusajs/icons"

interface DataGridQuantityPriceCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  code: string
  onPriceCellClick?: (context: any, currencyCode: string) => void
}

export const DataGridQuantityPriceCell = <TData, TValue = any>({
  context,
  code,
  onPriceCellClick,
}: DataGridQuantityPriceCellProps<TData, TValue>) => {

  return (
    <div
      className="relative flex size-full items-center group"
      onClick={() => onPriceCellClick?.(context, code)}
    >
      <DataGridCurrencyCell code={code} context={context} />
      <div className="absolute right-1 flex items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <ArrowsPointingOut className="text-ui-fg-muted size-3" />
      </div>
    </div>
  )
}
