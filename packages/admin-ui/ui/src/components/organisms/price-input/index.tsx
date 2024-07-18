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
    <div className="relative w-[314px]">
      <div className="absolute left-3 top-0 flex h-full items-center">
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
        className="focus:border-violet-6 border-grey-20
            bg-grey-5 text-gray-90 text-small
            h-[40px] w-full
            rounded-lg border
            border-solid
            py-[10px]
            ps-12
            text-end
            focus:bg-white"
      />

      <div className="absolute right-3 top-0 flex h-full items-center">
        <span className="text-small text-grey-40 mt-[1px]">
          {symbol_native}
        </span>
      </div>
    </div>
  )
}

export default PriceInput
