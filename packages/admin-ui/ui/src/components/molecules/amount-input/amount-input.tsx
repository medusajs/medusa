import clsx from "clsx"
import React, { useEffect, useState } from "react"
import AmountField from "react-currency-input-field"
import { currencies } from "../../../utils/currencies"
import InputError from "../../atoms/input-error"
import InputHeader from "../../fundamentals/input-header"

type Props = {
  currencyCode: string
  value?: number | null
  onChange: (amount?: number | null) => void
  errors?: { [x: string]: unknown }
  name?: string
  label?: string
}

const AmountInput = ({
  name,
  label,
  currencyCode,
  errors,
  value,
  onChange,
}: Props) => {
  const { symbol_native, decimal_digits } = currencies[
    currencyCode.toUpperCase()
  ]

  const getFormattedValue = (value: number) => {
    return `${value / 10 ** decimal_digits}`
  }

  const [formattedValue, setFormattedValue] = useState<string | undefined>(
    value !== undefined && value !== null ? getFormattedValue(value) : undefined
  )

  useEffect(() => {
    if (value) {
      setFormattedValue(getFormattedValue(value))
    }
  }, [value, decimal_digits])

  const onAmountChange = (value?: string, floatValue?: number | null) => {
    if (floatValue) {
      const numericalValue = Math.round(floatValue * 10 ** decimal_digits)
      onChange(numericalValue)
    } else {
      onChange(0)
    }
    setFormattedValue(value)
  }

  const step = 10 ** -decimal_digits

  return (
    <div>
      {label && <InputHeader label={label} className="mb-xsmall" />}
      <div
        className={clsx(
          "w-full flex items-center bg-grey-5 border border-gray-20 px-base py-xsmall rounded-rounded h-10 focus-within:shadow-input focus-within:border-violet-60 inter-base-regular",
          {
            "border-rose-50": errors && name && errors[name],
          }
        )}
      >
        <div className="inter-base-regular text-grey-40">
          <p>{currencyCode.toUpperCase()}</p>
        </div>

        <div className="flex items-center gap-2xsmall w-full">
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
          <div className="flex items-center min-w-[16px] ml-2xsmall">
            <p className="text-grey-40 w-full text-right">{symbol_native}</p>
          </div>
        </div>
      </div>
      <InputError name={name} errors={errors} />
    </div>
  )
}

export default AmountInput
