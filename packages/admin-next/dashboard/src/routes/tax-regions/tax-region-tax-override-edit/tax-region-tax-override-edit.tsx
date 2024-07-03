import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/modals"

export const TaxRegionTaxOverrideEdit = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("taxRegions.taxOverrides.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("taxRegions.taxOverrides.edit.hint")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
    </RouteDrawer>
  )
}
