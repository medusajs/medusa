import React from "react"
import AmountField from "react-currency-input-field"

import { CurrencyType } from "../../../utils/currencies"

/**
 * `PriceInput` interface
 */
export type PriceInputProps = {
  amount?: string
  currency: CurrencyType
  onAmountChange: (amount?: string, floatAmount?: number | null) => void
}

/**
 * A controlled input component that renders the formatted amount
 * and the currency of the provided price.
 */
function PriceInput(props: PriceInputProps) {
  const { amount, currency, onAmountChange } = props
  const { code, symbol_native, decimal_digits } = currency

  /** ******** COMPUTED **********/

  const step = 10 ** -decimal_digits
  const rightOffset = 24 + symbol_native.length * 4
  const placeholder = `0.${"0".repeat(decimal_digits)}`

  return (
    <div className="w-[314px] relative">
      <div className="absolute flex items-center h-full top-0 left-3">
        <span className="text-small text-grey-40 mt-[1px]">{code}</span>
      </div>

      <AmountField
        step={step}
        value={amount}
        onValueChange={(value, _name, values) =>
          onAmountChange(value, values?.float)
        }
        allowNegativeValue={false}
        placeholder={placeholder}
        decimalScale={decimal_digits}
        style={{ paddingRight: rightOffset }}
        className="focus:bg-white focus:border-violet-6
            border border-solid border-grey-20
            w-full h-[40px]
            py-[10px] pl-12
            rounded-lg
            bg-grey-5
            text-gray-90
            text-right
            text-small"
      />

      <div className="absolute flex items-center h-full top-0 right-3">
        <span className="text-small text-grey-40 mt-[1px]">
          {symbol_native}
        </span>
      </div>
    </div>
  )
}

export default PriceInput
