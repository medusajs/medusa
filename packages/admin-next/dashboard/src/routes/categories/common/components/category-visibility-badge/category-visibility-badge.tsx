import { StatusBadge } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type CategoryVisibilityBadgeProps = {
  isInternal: boolean
}

export const CategoryVisibilityBadge = ({
  isInternal,
}: CategoryVisibilityBadgeProps) => {
  const { t } = useTranslation()

  const color = isInternal ? "blue" : "green"
  const text = isInternal
    ? t("categories.visibility.internal")
    : t("categories.visibility.public")
  return <StatusBadge color={color}>{text}</StatusBadge>
}
