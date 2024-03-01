import { PaymentProvider } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import { formatProvider } from "../../../../../lib/format-provider"
import { PlaceholderCell } from "../../common/placeholder-cell"

type PaymentProvidersCellProps = {
  paymentProviders?: PaymentProvider[] | null
}

export const PaymentProvidersCell = ({
  paymentProviders,
}: PaymentProvidersCellProps) => {
  const { t } = useTranslation()

  if (!paymentProviders || paymentProviders.length === 0) {
    return <PlaceholderCell />
  }

  const displayValue = paymentProviders
    .slice(0, 2)
    .map((p) => formatProvider(p.id))
    .join(", ")

  const additionalProviders = paymentProviders.slice(2).length

  const text = `${displayValue}${
    additionalProviders > 0
      ? ` ${t("general.plusCountMore", {
          count: additionalProviders,
        })}`
      : ""
  }`

  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">{text}</span>
    </div>
  )
}

export const PaymentProvidersHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">{t("fields.paymentProviders")}</span>
    </div>
  )
}
