import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { usePriceList } from "../../../hooks/api/price-lists"
import { PriceListConfigurationForm } from "./components/price-list-configuration-form"

export const PricingConfiguration = () => {
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
        <Heading>{t("pricing.configuration.editHeader")}</Heading>
      </RouteDrawer.Header>
      {ready && <PriceListConfigurationForm priceList={price_list} />}
    </RouteDrawer>
  )
}
