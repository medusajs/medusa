import { CurrencyDTO } from "@medusajs/types"
import { useRef } from "react"
import Primitive from "react-currency-input-field"
import { Controller, FieldValues } from "react-hook-form"

import { GridCellType } from "../../../constants"
import { CellProps } from "../../../types"

interface CurrencyCellProps<TFieldValues extends FieldValues = any>
  extends CellProps<TFieldValues> {
  currency: CurrencyDTO
}

export const CurrencyCell = ({ currency, field, meta }: CurrencyCellProps) => {
  const symbolRef = useRef<HTMLSpanElement>(null)
  // @ts-ignore - Type is wrong
  const decimalScale = currency.decimal_digits

  const { control } = meta

  return (
    <Controller
      control={control}
      name={field}
      render={({ field: { onChange, ...rest } }) => {
        return (
          <div className="relative size-full">
            <span
              ref={symbolRef}
              role="presentation"
              className="text-ui-fg-muted txt-compact-small pointer-events-none absolute left-0 top-0 select-none py-2.5 pl-4"
            >
              {currency.symbol_native}
            </span>
            <Primitive
              data-input-field="true"
              data-field-id={field}
              data-cell-type={GridCellType.EDITABLE}
              className="size-full bg-transparent py-2.5 pr-4 text-right outline-none"
              style={{
                paddingLeft: symbolRef.current?.offsetWidth
                  ? `${symbolRef.current.offsetWidth + 8}px`
                  : "16px",
              }}
              decimalScale={decimalScale}
              allowDecimals={decimalScale > 0}
              onValueChange={(_value, _name, values) => {
                onChange(values?.value)
              }}
              {...rest}
            />
          </div>
        )
      }}
    />
  )
}
