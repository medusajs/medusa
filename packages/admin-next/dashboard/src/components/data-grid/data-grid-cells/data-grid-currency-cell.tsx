import CurrencyInput from "react-currency-input-field"
import { Controller } from "react-hook-form"

import { currencies } from "../../../lib/data/currencies"
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

  const input = container.input

  const currency = currencies[code.toUpperCase()]

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { value, onChange, onBlur, ...field } }) => {
        return (
          <DataGridCellContainer {...container}>
            <div className="relative flex size-full items-center">
              <span
                className="txt-compact-small text-ui-fg-muted pointer-events-none absolute left-4 w-fit min-w-4"
                aria-hidden
              >
                {currency.symbol_native}
              </span>
              <CurrencyInput
                {...field}
                {...attributes}
                onFocus={(e) => {
                  e.target.select()
                  input.onFocus()
                }}
                onBlur={() => {
                  onBlur()
                  input.onBlur()
                }}
                className="txt-compact-small w-full flex-1 cursor-default appearance-none bg-transparent py-2.5 pl-12 pr-4 text-right outline-none"
                value={value}
                onValueChange={(_value, _name, values) => {
                  onChange(values?.value)
                }}
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
