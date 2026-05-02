import { Control, useWatch } from "react-hook-form"
import { Text } from "@medusajs/ui"
import { CurrencyInfo } from "../../../lib/data/currencies"
import { getLocaleAmount } from "../../../lib/money-amount-helpers"

interface AmountDisplayProps {
  index: number
  control: Control<any>
  currency: CurrencyInfo
}

export const AmountDisplay = ({
  index,
  control,
  currency,
}: AmountDisplayProps) => {
  const amount = useWatch({
    control,
    name: `prices.${index}.amount`,
  })

  return (
    <Text size="small" weight="plus">
      {amount ? getLocaleAmount(Number(amount), currency.code) : "—"}
    </Text>
  )
}
