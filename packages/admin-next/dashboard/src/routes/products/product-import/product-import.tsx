import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../components/modals"
import { useTranslation } from "react-i18next"

export const ProductImport = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("products.import.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("products.import.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <RouteDrawer.Body></RouteDrawer.Body>
    </RouteDrawer>
  )
}
