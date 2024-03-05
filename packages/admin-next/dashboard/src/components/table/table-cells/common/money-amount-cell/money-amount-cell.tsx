import { clx } from "@medusajs/ui"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { PlaceholderCell } from "../placeholder-cell"

type MoneyAmountCellProps = {
  currencyCode: string
  amount?: number | null
  align?: "left" | "right"
}

export const MoneyAmountCell = ({
  currencyCode,
  amount,
  align = "left",
}: MoneyAmountCellProps) => {
  if (!amount) {
    return <PlaceholderCell />
  }

  const formatted = getStylizedAmount(amount, currencyCode)

  return (
    <div
      className={clx("flex h-full w-full items-center overflow-hidden", {
        "justify-start text-left": align === "left",
        "justify-end text-right": align === "right",
      })}
    >
      <span className="truncate">{formatted}</span>
    </div>
  )
}
