import clsx from "clsx"
import { useEffect, useState } from "react"
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
  const { symbol_native, decimal_digits } =
    currencies[currencyCode.toUpperCase()]

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
          "bg-grey-5 border-gray-20 px-base py-xsmall rounded-rounded focus-within:shadow-input focus-within:border-violet-60 inter-base-regular flex h-10 w-full items-center border",
          {
            "border-rose-50": errors && name && errors[name],
          }
        )}
      >
        <div className="inter-base-regular text-grey-40">
          <p>{currencyCode.toUpperCase()}</p>
        </div>

        <div className="gap-2xsmall flex w-full items-center">
          <AmountField
            step={step}
            value={formattedValue}
            onValueChange={(value, _name, values) =>
              onAmountChange(value, values?.float)
            }
            allowNegativeValue={false}
            placeholder="-"
            decimalScale={decimal_digits}
            className="remove-number-spinner leading-base text-grey-90 caret-violet-60 placeholder-grey-40 w-full bg-transparent text-end font-normal outline-none outline-0"
          />
          <div className="ms-2xsmall flex min-w-[16px] items-center">
            <p className="text-grey-40 w-full text-end">{symbol_native}</p>
          </div>
        </div>
      </div>
      <InputError name={name} errors={errors} />
    </div>
  )
}

export default AmountInput
