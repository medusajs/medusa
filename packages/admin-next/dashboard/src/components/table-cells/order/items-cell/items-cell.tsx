import type { LineItem } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

export const ItemsCell = ({ items }: { items: LineItem[] }) => {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full overflow-hidden flex items-center">
      <span className="truncate">
        {t("general.items", {
          count: items.length,
        })}
      </span>
    </div>
  )
}

export const ItemsHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full h-full flex items-center">
      <span className="truncate">{t("fields.items")}</span>
    </div>
  )
}
