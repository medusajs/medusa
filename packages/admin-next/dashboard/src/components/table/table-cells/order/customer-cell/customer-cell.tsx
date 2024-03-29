import { Customer } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"

export const CustomerCell = ({ customer }: { customer: Customer | null }) => {
  if (!customer) {
    return <span className="text-ui-fg-muted">-</span>
  }

  const { first_name, last_name, email } = customer
  const name = [first_name, last_name].filter(Boolean).join(" ")

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{name || email}</span>
    </div>
  )
}

export const CustomerHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full items-center">
      <span className="truncate">{t("fields.customer")}</span>
    </div>
  )
}
