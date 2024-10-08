import { BuildingTax } from "@medusajs/icons"
import { Tooltip, clx } from "@medusajs/ui"
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
      <BuildingTax className={clx({ "text-ui-fg-muted": !includesTax })} />
    </Tooltip>
  )
}
