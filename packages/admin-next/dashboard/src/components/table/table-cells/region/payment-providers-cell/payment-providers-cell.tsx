import { PaymentProvider } from "@medusajs/medusa"
import { Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
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
    .map((p) => p.id)
    .join(", ")

  const additionalProviders = paymentProviders.slice(2).map((c) => c.id)

  return (
    <div className="flex size-full items-center gap-x-1">
      <span>{displayValue}</span>
      {additionalProviders.length > 0 && (
        <Tooltip
          content={
            <ul>
              {additionalProviders.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          }
        >
          <span>
            {t("general.plusCountMore", {
              count: additionalProviders.length,
            })}
          </span>
        </Tooltip>
      )}
    </div>
  )
}

export const PaymentProvidersHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full items-center">
      <span>{t("fields.paymentProviders")}</span>
    </div>
  )
}
