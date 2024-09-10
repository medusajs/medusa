import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../placeholder-cell"

type EmailCellProps = {
  email?: string | null
}

export const EmailCell = ({ email }: EmailCellProps) => {
  if (!email) {
    return <PlaceholderCell />
  }

  return (
    <div className="flex h-full w-full items-center overflow-hidden">
      <span className="truncate">{email}</span>
    </div>
  )
}

export const EmailHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.email")}</span>
    </div>
  )
}
