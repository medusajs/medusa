import clsx from "clsx"
import React, { useEffect, useState } from "react"
import AmountField from "react-currency-input-field"
import InputError from "../../../../components/atoms/input-error"
import { currencies } from "../../../../utils/currencies"

type Props = {
  currencyCode: string
  amount?: number | null
  onChange: (amount?: number) => void
  errors?: { [x: string]: unknown }
  name?: string
}

const PriceFormInput = ({
  name,
  currencyCode,
  errors,
  amount,
  onChange,
}: Props) => {
  const { symbol_native, decimal_digits } = currencies[
    currencyCode.toUpperCase()
  ]

  const getFormattedValue = (value: number) => {
    return `${value / 10 ** decimal_digits}`
  }

  const [formattedValue, setFormattedValue] = useState<string | undefined>(
    amount !== null && amount !== undefined
      ? getFormattedValue(amount)
      : undefined
  )

  useEffect(() => {
    if (amount) {
      setFormattedValue(getFormattedValue(amount))
    }
  }, [amount, decimal_digits])

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
      <div
        className={clsx(
          "w-full flex items-center bg-grey-5 border border-gray-20 px-small py-xsmall rounded-rounded h-10 focus-within:shadow-input focus-within:border-violet-60",
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
          className="bg-transparent outline-none outline-0 w-full remove-number-spinner leading-base text-grey-90 font-normal caret-violet-60 placeholder-grey-40 text-right"
        />
      </div>
      <InputError name={name} errors={errors} />
    </div>
  )
}

export default PriceFormInput
