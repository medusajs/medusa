import { Heading } from "@medusajs/ui"
import { useAdminPriceList } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditPriceListForm } from "./components/edit-price-list-form"

export const PricingEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { price_list, isLoading, isError, error } = useAdminPriceList(id!)

  const ready = !isLoading && price_list

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("pricing.settings.editPriceListTitle")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditPriceListForm priceList={price_list} />}
    </RouteDrawer>
  )
}
