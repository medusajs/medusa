import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export const ReturnShippingPlaceholder = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-[120px] flex-col items-center justify-center gap-2 p-2 text-center">
      <span className="txt-small text-ui-fg-subtle font-medium">
        {t("orders.returns.placeholders.noReturnShippingOptions.title")}
      </span>

      <span className="txt-small text-ui-fg-muted">
        <Trans
          i18nKey="orders.returns.placeholders.noReturnShippingOptions.hint"
          components={{
            LinkComponent: (
              <Link to={`/settings/locations`} className="text-blue-500" />
            ),
          }}
        />
      </span>
    </div>
  )
}

export const OutboundShippingPlaceholder = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-[120px] flex-col items-center justify-center gap-2 p-2 text-center">
      <span className="txt-small text-ui-fg-subtle font-medium">
        {t("orders.returns.placeholders.outboundShippingOptions.title")}
      </span>

      <span className="txt-small text-ui-fg-muted">
        <Trans
          i18nKey="orders.returns.placeholders.outboundShippingOptions.hint"
          components={{
            LinkComponent: (
              <Link to={`/settings/locations`} className="text-blue-500" />
            ),
          }}
        />
      </span>
    </div>
  )
}
