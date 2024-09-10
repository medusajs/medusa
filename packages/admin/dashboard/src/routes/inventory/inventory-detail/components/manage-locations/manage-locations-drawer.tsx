import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../../../components/modals"
import { useInventoryItem } from "../../../../../hooks/api/inventory"
import { useStockLocations } from "../../../../../hooks/api/stock-locations"
import { ManageLocationsForm } from "./components/manage-locations-form"

export const ManageLocationsDrawer = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const {
    inventory_item: inventoryItem,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItem(id!)

  const { stock_locations, isLoading: loadingLocations } = useStockLocations()

  const ready =
    !isLoading && !loadingLocations && inventoryItem && stock_locations

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("inventory.manageLocations")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <ManageLocationsForm item={inventoryItem} locations={stock_locations} />
      )}
    </RouteDrawer>
  )
}
