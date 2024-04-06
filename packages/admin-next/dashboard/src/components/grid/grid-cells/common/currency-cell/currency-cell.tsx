import Primitive from "react-currency-input-field"

import { useRef } from "react"
import { Controller, FieldValues } from "react-hook-form"
import { useCurrency } from "../../../../../hooks/api/currencies"
import { GridCellType } from "../../../constants"
import { FieldProps } from "../../../types"

interface CurrencyCellProps<TFieldValues extends FieldValues = any>
  extends FieldProps<TFieldValues> {
  code: string
}

export const CurrencyCell = ({ code, field, meta }: CurrencyCellProps) => {
  const symbolRef = useRef<HTMLSpanElement>(null)

  const { control } = meta

  const { currency } = useCurrency(code)

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
              {currency?.symbol_native}
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
              decimalScale={2}
              allowDecimals={true}
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
