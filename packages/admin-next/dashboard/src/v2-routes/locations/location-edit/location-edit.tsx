import { EditLocationForm } from "../../../modules/locations/location-edit/components/edit-location-form/edit-location-form"
import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../components/route-modal"
import { useAdminStockLocations } from "medusa-react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const LocationEdit = () => {
  const { id } = useParams()

  const { stock_locations, isLoading, isError, error } = useAdminStockLocations(
    {
      id,
      expand: "address",
    }
  )

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
