import { StatusBadge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type CategoryStatusBadgeProps = {
  isActive: boolean
}

export const CategoryStatusBadge = ({ isActive }: CategoryStatusBadgeProps) => {
  const { t } = useTranslation()

  const color = isActive ? "green" : "grey"
  const text = isActive
    ? t("categories.status.active")
    : t("categories.status.inactive")
  return <StatusBadge color={color}>{text}</StatusBadge>
}
