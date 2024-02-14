import { clx } from "@medusajs/ui"
import { getPresentationalAmount } from "../../../../../lib/money-amount-helpers"
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

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(0)

  const symbol = formatted.replace(/\d/g, "").replace(/[.,]/g, "").trim()

  const presentationAmount = getPresentationalAmount(amount, currencyCode)
  const formattedTotal = new Intl.NumberFormat(undefined, {
    style: "decimal",
  }).format(presentationAmount)

  return (
    <div
      className={clx("flex h-full w-full items-center overflow-hidden", {
        "justify-start text-left": align === "left",
        "justify-end text-right": align === "right",
      })}
    >
      <span className="truncate">
        {symbol} {formattedTotal} {currencyCode.toUpperCase()}
      </span>
    </div>
  )
}
