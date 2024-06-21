import CurrencyInput from "react-currency-input-field"
import { Controller } from "react-hook-form"

import { currencies } from "../../../lib/currencies"
import { useDataGridCell } from "../hooks"
import { DataGridCellProps } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

interface DataGridCurrencyCellProps<TData, TValue = any>
  extends DataGridCellProps<TData, TValue> {
  code: string
}

export const DataGridCurrencyCell = <TData, TValue = any>({
  field,
  context,
  code,
}: DataGridCurrencyCellProps<TData, TValue>) => {
  const { control, attributes, container } = useDataGridCell({
    field,
    context,
  })

  const currency = currencies[code.toUpperCase()]

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <DataGridCellContainer {...container}>
            <div className="flex size-full items-center gap-2 px-4 py-2.5">
              <span className="txt-compact-small text-ui-fg-muted" aria-hidden>
                {currency.symbol_native}
              </span>
              <CurrencyInput
                {...field}
                {...attributes}
                className="txt-compact-small w-full flex-1 appearance-none bg-transparent text-right outline-none"
                value={value}
                onValueChange={(_value, _name, values) =>
                  onChange(values?.value)
                }
                decimalScale={currency.decimal_digits}
                decimalsLimit={currency.decimal_digits}
              />
            </div>
          </DataGridCellContainer>
        )
      }}
    />
  )
}
