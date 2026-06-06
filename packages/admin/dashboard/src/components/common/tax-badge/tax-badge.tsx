import { TaxExclusive, TaxInclusive } from "@zjedene-medusa/icons"
import { Tooltip } from "@zjedene-medusa/ui"
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
        <TaxInclusive className="text-ui-fg-muted shrink-0" />
      ) : (
        <TaxExclusive className="text-ui-fg-muted shrink-0" />
      )}
    </Tooltip>
  )
}
