import { HttpTypes } from "@medusajs/types"
import { Alert, Button, Text } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { getCountryProvinceObjectByIso2 } from "../../../../../lib/data/country-states"

type TaxRegionSublevelAlertProps = {
  taxRegion: HttpTypes.AdminTaxRegion
  showSublevelRegions: boolean
  setShowSublevelRegions: (state: boolean) => void
}

export const TaxRegionSublevelAlert = ({
  taxRegion,
  showSublevelRegions,
  setShowSublevelRegions,
}: TaxRegionSublevelAlertProps) => {
  const { t } = useTranslation()

  const [dismissed, setDismissed] = useState(false)
  const provinceObject = getCountryProvinceObjectByIso2(taxRegion.country_code!)

  if (
    provinceObject ||
    showSublevelRegions ||
    dismissed ||
    taxRegion.children.length
  ) {
    return null
  }

  return (
    <Alert dismissible variant="info" className="bg-ui-bg-base">
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-col">
          <Text size="small" leading="compact" weight="plus" asChild>
            <h2>{t("taxRegions.fields.sublevels.alert.header")}</h2>
          </Text>
          <Text size="small" leading="compact" className="text-pretty">
            {t("taxRegions.fields.sublevels.alert.description")}
          </Text>
        </div>
        <div className="flex items-center gap-x-3">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setShowSublevelRegions(true)}
          >
            {t("taxRegions.fields.sublevels.alert.action")}
          </Button>
          <Button
            variant="transparent"
            size="small"
            onClick={() => setDismissed(true)}
          >
            {t("actions.hide")}
          </Button>
        </div>
      </div>
    </Alert>
  )
}
