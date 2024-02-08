import { useTranslation } from "react-i18next"
import { MoneyAmountCell } from "../../common/money-amount-cell"

type TotalCellProps = {
  currencyCode: string
  total: number | null
}

export const TotalCell = ({ currencyCode, total }: TotalCellProps) => {
  return (
    <MoneyAmountCell align="right" currencyCode={currencyCode} amount={total} />
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
