import * as React from "react"

import PriceInput, { PriceInputProps } from "../price-input"

import { CurrencyType } from "../../../utils/currencies"

type MedusaPriceInputProps = {
  amount: number
  currency: CurrencyType
  onChange: (amount?: number) => void
}

/**
 * A controlled input component that wraps around PriceInput and renders the amount
 * and the currency of the provided price coming from a medusa server.
 */
function MedusaPriceInput(props: MedusaPriceInputProps) {
  const [rawValue, setRawValue] = React.useState<string | undefined>(
    `${props.amount || 0}`
  )
  const { amount, currency, onChange } = props
  const { decimal_digits } = currency

  React.useEffect(() => {
    const value = amount / 10 ** decimal_digits
    setRawValue(`${value}`)
  }, [amount, decimal_digits])

  /** ******** HANDLERS **********/

  const onAmountChange: PriceInputProps["onAmountChange"] = (
    value?: string,
    floatValue?: number | null
  ) => {
    if (typeof floatValue === "number") {
      const numericalValue = Math.round(floatValue * 10 ** decimal_digits)
      onChange(numericalValue)
    } else {
      onChange(null)
    }
    setRawValue(value)
  }

  return (
    <PriceInput
      amount={rawValue}
      onAmountChange={onAmountChange}
      currency={currency}
    />
  )
}

export default MedusaPriceInput
