import { useTranslation } from "react-i18next"
import { getPresentationalAmount } from "../../../../../lib/money-amount-helpers"

type TotalCellProps = {
  currencyCode: string
  total: number | null
}

export const TotalCell = ({ currencyCode, total }: TotalCellProps) => {
  if (!total) {
    return <span className="text-ui-fg-muted">-</span>
  }

  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(0)

  const symbol = formatted.replace(/\d/g, "").replace(/[.,]/g, "").trim()

  const presentationAmount = getPresentationalAmount(total, currencyCode)
  const formattedTotal = new Intl.NumberFormat(undefined, {
    style: "decimal",
  }).format(presentationAmount)

  return (
    <div className="flex h-full w-full items-center justify-end overflow-hidden">
      <span className="truncate">
        {symbol} {formattedTotal} {currencyCode.toUpperCase()}
      </span>
    </div>
  )
}

export const TotalHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center justify-end">
      <span className="truncate">{t("fields.total")}</span>
    </div>
  )
}
