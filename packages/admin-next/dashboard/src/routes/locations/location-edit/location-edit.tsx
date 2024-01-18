import { Drawer, Heading } from "@medusajs/ui"
import { useAdminStockLocations } from "medusa-react"
import { useTranslation } from "react-i18next"
import { json, useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditLocationForm } from "./components/edit-location-form/edit-location-form"

export const LocationEdit = () => {
  const [open, onOpenChange] = useRouteModalState()
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

  if (!isLoading && !stock_location) {
    throw json({ message: "Not found" }, 404)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading className="capitalize">
            {t("locations.editLocation")}
          </Heading>
        </Drawer.Header>
        {isLoading || !stock_location ? (
          <div>Loading...</div>
        ) : (
          <EditLocationForm location={stock_location} />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
