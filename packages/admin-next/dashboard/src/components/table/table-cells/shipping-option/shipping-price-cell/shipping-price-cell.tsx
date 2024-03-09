import { useTranslation } from "react-i18next"
import { MoneyAmountCell } from "../../common/money-amount-cell"
import { PlaceholderCell } from "../../common/placeholder-cell"

type ShippingPriceCellProps = {
  isCalculated: boolean
  price?: number | null
  currencyCode: string
}

export const ShippingPriceCell = ({
  price,
  currencyCode,
  isCalculated,
}: ShippingPriceCellProps) => {
  if (isCalculated || !price) {
    return <PlaceholderCell />
  }

  return <MoneyAmountCell currencyCode={currencyCode} amount={price} />
}

export const ShippingPriceHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center overflow-hidden">
      <span className="truncate">{t("fields.price")}</span>
    </div>
  )
}
