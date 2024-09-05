import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../common/placeholder-cell"

type ShippingOptionCellProps = {
  name?: string | null
}

export const ShippingOptionCell = ({ name }: ShippingOptionCellProps) => {
  if (!name) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">{name}</span>
    </div>
  )
}

export const ShippingOptionHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center overflow-hidden">
      <span className="truncate">{t("fields.name")}</span>
    </div>
  )
}
