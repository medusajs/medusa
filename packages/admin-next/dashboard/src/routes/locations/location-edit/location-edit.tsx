import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useStockLocation } from "../../../hooks/api/stock-locations"
import { EditLocationForm } from "./components/edit-location-form"

export const LocationEdit = () => {
  const { t } = useTranslation()
  const { location_id } = useParams()

  const { stock_location, isPending, isError, error } = useStockLocation(
    location_id!,
    {
      fields: "*address",
    }
  )

  const ready = !isPending && !!stock_location

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading className="capitalize">{t("locations.editLocation")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditLocationForm location={stock_location} />}
    </RouteDrawer>
  )
}
