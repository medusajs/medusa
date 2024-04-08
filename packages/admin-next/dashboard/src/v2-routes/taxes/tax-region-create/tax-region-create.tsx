import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/route-modal"
import { TaxRegionCreateForm } from "./components"

export const TaxRegionCreate = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("taxRegions.create.title")}</Heading>
      </RouteDrawer.Header>

      <TaxRegionCreateForm />
    </RouteDrawer>
  )
}
