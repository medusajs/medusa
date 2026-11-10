import { TaxExclusive, TaxInclusive } from "@medusajs/icons"
import { Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type IncludesTaxTooltipProps = {
  includesTax?: boolean
}

export const IncludesTaxTooltip = ({
  includesTax,
}: IncludesTaxTooltipProps) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      maxWidth={999}
      content={
        includesTax
          ? t("general.includesTaxTooltip")
          : t("general.excludesTaxTooltip")
      }
    >
      {includesTax ? (
        <TaxInclusive className="shrink-0 text-ui-fg-muted" />
      ) : (
        <TaxExclusive className="shrink-0 text-ui-fg-muted" />
      )}
    </Tooltip>
  )
}
