import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { EditLocationForm } from "./components/edit-location-form"

export const LocationEdit = () => {
  const { location_id } = useParams()

  const {
    stock_location,
    isPending: isLoading,
    isError,
    error,
  } = useStockLocation(location_id, {
    fields: "*address",
  })

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

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
