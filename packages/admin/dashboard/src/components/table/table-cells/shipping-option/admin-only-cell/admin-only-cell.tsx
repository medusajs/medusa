import { useTranslation } from "react-i18next"
import { StatusCell } from "../../common/status-cell"

type AdminOnlyCellProps = {
  adminOnly: boolean
}

export const AdminOnlyCell = ({ adminOnly }: AdminOnlyCellProps) => {
  const { t } = useTranslation()

  const color = adminOnly ? "blue" : "green"
  const text = adminOnly ? t("general.admin") : t("general.store")

  return <StatusCell color={color}>{text}</StatusCell>
}

export const AdminOnlyHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center overflow-hidden">
      <span className="truncate">{t("fields.availability")}</span>
    </div>
  )
}
