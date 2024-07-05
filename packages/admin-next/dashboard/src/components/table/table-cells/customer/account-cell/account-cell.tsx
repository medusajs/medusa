import { useTranslation } from "react-i18next"
import { StatusCell } from "../../common/status-cell"

type AccountCellProps = {
  hasAccount: boolean
}

export const AccountCell = ({ hasAccount }: AccountCellProps) => {
  const { t } = useTranslation()

  const color = hasAccount ? "green" : ("orange" as const)
  const text = hasAccount
    ? t("customers.fields.registered")
    : t("customers.fields.guest")

  return <StatusCell color={color}>{text}</StatusCell>
}

export const AccountHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.account")}</span>
    </div>
  )
}
