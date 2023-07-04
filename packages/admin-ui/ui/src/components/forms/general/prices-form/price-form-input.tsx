import clsx from "clsx"
import { useCallback, useEffect, useState } from "react"
import AmountField from "react-currency-input-field"
import { currencies } from "../../../../utils/currencies"
import InputError from "../../../atoms/input-error"
import InputHeader from "../../../fundamentals/input-header"

type Props = {
  currencyCode: string
  amount?: number | null
  onChange: (amount?: number) => void
  errors?: { [x: string]: unknown }
  name?: string
  label?: string
  required?: boolean
}

const PriceFormInput = ({
  name,
  currencyCode,
  errors,
  amount,
  onChange,
  label,
  required,
}: Props) => {
  const { symbol_native, decimal_digits } =
    currencies[currencyCode.toUpperCase()]

  const getFormattedValue = useCallback(
    (value: number) => {
      return `${value / 10 ** decimal_digits}`
    },
    [decimal_digits]
  )

  const [formattedValue, setFormattedValue] = useState<string | undefined>(
    amount !== null && amount !== undefined
      ? getFormattedValue(amount)
      : undefined
  )

  useEffect(() => {
    if (amount) {
      setFormattedValue(getFormattedValue(amount))
    }
  }, [amount, decimal_digits, getFormattedValue])

  const onAmountChange = (value?: string, floatValue?: number | null) => {
    if (typeof floatValue === "number") {
      const numericalValue = Math.round(floatValue * 10 ** decimal_digits)
      onChange(numericalValue)
    } else {
      onChange(undefined)
    }
    setFormattedValue(value)
  }

  const step = 10 ** -decimal_digits

  return (
    <div>
      {label && <InputHeader {...{ label, required }} className="mb-xsmall" />}
      <div
        className={clsx(
          "bg-grey-5 border-gray-20 px-small py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 flex h-10 w-full items-center border",
          {
            "border-rose-50": errors && name && errors[name],
          }
        )}
      >
        <span className="inter-base-regular text-grey-40">{symbol_native}</span>

        <AmountField
          step={step}
          value={formattedValue}
          onValueChange={(value, _name, values) =>
            onAmountChange(value, values?.float)
          }
          allowNegativeValue={false}
          placeholder="-"
          decimalScale={decimal_digits}
          className="remove-number-spinner leading-base text-grey-90 caret-violet-60 placeholder-grey-40 w-full bg-transparent text-right font-normal outline-none outline-0"
        />
      </div>
      <InputError name={name} errors={errors} />
    </div>
  )
}

export default PriceFormInput
