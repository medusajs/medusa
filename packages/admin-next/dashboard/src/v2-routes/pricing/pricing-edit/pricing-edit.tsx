import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { usePriceList } from "../../../hooks/api/price-lists"
import { EditPriceListForm } from "./components/edit-price-list-form"

export const PricingEdit = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { price_list, isLoading, isError, error } = usePriceList(id!)

  const ready = !isLoading && price_list

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("pricing.edit.header")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditPriceListForm priceList={price_list} />}
    </RouteDrawer>
  )
}
