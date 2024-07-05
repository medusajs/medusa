import { BuildingTax } from "@medusajs/icons"
import { Tooltip } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type IncludesTaxTooltipProps = {
  includesTax?: boolean
}

export const IncludesTaxTooltip = ({
  includesTax,
}: IncludesTaxTooltipProps) => {
  const { t } = useTranslation()

  if (!includesTax) {
    return null
  }

  return (
    <Tooltip content={t("general.includesTaxTooltip")}>
      <BuildingTax className="text-ui-fg-muted" />
    </Tooltip>
  )
}
