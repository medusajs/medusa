import { FulfillmentProvider } from "@medusajs/medusa"
import { Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { PlaceholderCell } from "../../common/placeholder-cell"

type FulfillmentProvidersCellProps = {
  fulfillmentProviders?: FulfillmentProvider[] | null
}

export const FulfillmentProvidersCell = ({
  fulfillmentProviders,
}: FulfillmentProvidersCellProps) => {
  const { t } = useTranslation()

  if (!fulfillmentProviders || fulfillmentProviders.length === 0) {
    return <PlaceholderCell />
  }

  const displayValue = fulfillmentProviders
    .slice(0, 2)
    .map((p) => p.id)
    .join(", ")

  const additionalProviders = fulfillmentProviders.slice(2).map((c) => c.id)

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

export const FulfillmentProvidersHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full items-center">
      <span>{t("fields.fulfillmentProviders")}</span>
    </div>
  )
}
