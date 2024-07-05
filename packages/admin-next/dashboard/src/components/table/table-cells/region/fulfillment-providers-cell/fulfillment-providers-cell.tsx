import { FulfillmentProvider } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import { formatProvider } from "../../../../../lib/format-provider"
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
    .map((p) => formatProvider(p.id))
    .join(", ")

  const additionalProviders = fulfillmentProviders.slice(2).length

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

export const FulfillmentProvidersHeader = () => {
  const { t } = useTranslation()

  return (
    <div className="flex size-full items-center overflow-hidden">
      <span className="truncate">{t("fields.fulfillmentProviders")}</span>
    </div>
  )
}
