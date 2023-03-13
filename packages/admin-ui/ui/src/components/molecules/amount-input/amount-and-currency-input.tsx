import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import AmountField from "react-currency-input-field"
import { Option } from "../../../types/shared"
import { currencies } from "../../../utils/currencies"
import InputError from "../../atoms/input-error"
import InputHeader from "../../fundamentals/input-header"
import { NextSelect } from "../select/next-select"

type Value = {
  amount: number | null | undefined
  currency: Option | null | undefined
}

type Props = {
  label?: string
  errors?: Record<string, unknown>
  name?: string
  onChange: (value: Value) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  value: Value
}

const AmountAndCurrencyInput = ({
  label,
  errors,
  name,
  value,
  onChange,
  onBlur,
}: Props) => {
  const { symbol_native, decimal_digits } = useMemo(() => {
    let symbol_native = "$"
    let decimal_digits = 2

    if (value.currency) {
      const currency = currencies[value.currency.value.toUpperCase()]

      symbol_native = currency.symbol_native
      decimal_digits = currency.decimal_digits
    }

    return { symbol_native, decimal_digits }
  }, [value])

  const step = useMemo(() => 10 ** -decimal_digits, [decimal_digits])

  const getFormattedValue = useCallback(
    (value: number) => {
      return `${value / 10 ** decimal_digits}`
    },
    [decimal_digits]
  )

  const [formattedValue, setFormattedValue] = useState<string | undefined>(
    value.amount !== undefined && value.amount !== null
      ? getFormattedValue(value.amount)
      : undefined
  )

  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Update the amount when the decimal digits change
   */
  useEffect(() => {
    inputRef.current?.dispatchEvent(new Event("blur"))
  }, [decimal_digits])

  const onCurrencyChange = (currency?: Option | null) => {
    onChange({ amount: value.amount, currency: currency })
  }

  /**
   * On amount change, update the amount and formatted value.
   * The amount passed to the onChange function is the DB persisted value,
   * the formatted value is the value that is displayed in the input.
   */
  const onAmountChange = (amount?: string, floatValue?: number | null) => {
    let numericalValue: number | null | undefined = 0

    if (floatValue) {
      numericalValue = Math.round(floatValue * 10 ** decimal_digits)
    }

    onChange({ amount: numericalValue, currency: value.currency })
    setFormattedValue(amount)
  }

  return (
    <div className="flex w-full flex-col">
      {label && <InputHeader label={label} className="mb-xsmall" />}
      <div className="focus-within:shadow-focus-border rounded-rounded">
        <div className="bg-grey-5 rounded-rounded shadow-border focus-within:shadow-cta relative h-10 transition-colors">
          <NextSelect
            customStyles={{
              control:
                "border-none absolute inset-0 bg-transparent focus-within:shadow-none !shadow-none focus-within:border-none pl-0",
              inner_control: "!max-w-[92px] border-r border-grey-20 pl-base",
            }}
            placeholder="USD"
            options={Object.values(currencies).map((c) => ({
              value: c.code,
              label: c.code,
            }))}
            isMulti={false}
            onBlur={onBlur}
            value={value.currency}
            onChange={onCurrencyChange}
          />
          <div className="pl-xsmall pr-base inter-base-regular absolute inset-y-0 left-[92px] right-0 flex h-10 items-center">
            <AmountField
              ref={inputRef}
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
            <div className="ml-2xsmall flex min-w-[16px] items-center">
              <p className="text-grey-40 w-full text-right">{symbol_native}</p>
            </div>
          </div>
        </div>
      </div>
      <InputError errors={errors} name={name} />
    </div>
  )
}

export default AmountAndCurrencyInput
