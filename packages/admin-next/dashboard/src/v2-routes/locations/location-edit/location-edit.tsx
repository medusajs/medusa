import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useStockLocations } from "../../../hooks/api/stock-locations"
import { EditLocationForm } from "./components/edit-location-form"

export const LocationEdit = () => {
  const { id } = useParams()

  const {
    stock_locations,
    isPending: isLoading,
    isError,
    error,
  } = useStockLocations({
    id,
    fields: "*address",
  })

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  const stock_location = stock_locations?.[0]

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading className="capitalize">{t("locations.editLocation")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && !!stock_location && (
        <EditLocationForm location={stock_location} />
      )}
    </RouteDrawer>
  )
}
