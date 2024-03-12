import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../common/placeholder-cell"

type PriceTypeCellProps = {
  priceType?: "flat_rate" | "calculated"
}

export const PriceTypeCell = ({ priceType }: PriceTypeCellProps) => {
  const { t } = useTranslation()

  if (!priceType) {
    return <PlaceholderCell />
  }

  const isFlatRate = priceType === "flat_rate"

  return (
    <div className="flex items-center overflow-hidden">
      <span className="truncate">
        {isFlatRate ? t("regions.flatRate") : t("regions.calculated")}
      </span>
    </div>
  )
}

export const PriceTypeHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center overflow-hidden">
      <span className="truncate">{t("regions.priceType")}</span>
    </div>
  )
}
