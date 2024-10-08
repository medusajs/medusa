import { InventoryTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../../../components/modals"
import { useInventoryItem } from "../../../../../hooks/api/inventory"
import { useStockLocation } from "../../../../../hooks/api/stock-locations"
import { AdjustInventoryForm } from "./components/adjust-inventory-form"

export const AdjustInventoryDrawer = () => {
  const { id, location_id } = useParams()
  const { t } = useTranslation()

  const {
    inventory_item: inventoryItem,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItem(id!)

  const inventoryLevel = inventoryItem?.location_levels!.find(
    (level: InventoryTypes.InventoryLevelDTO) =>
      level.location_id === location_id
  )

  const { stock_location, isLoading: isLoadingLocation } = useStockLocation(
    location_id!
  )

  const ready =
    !isLoading &&
    inventoryItem &&
    inventoryLevel &&
    !isLoadingLocation &&
    stock_location

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("inventory.manageLocations")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <AdjustInventoryForm
          item={inventoryItem}
          level={inventoryLevel}
          location={stock_location}
        />
      )}
    </RouteDrawer>
  )
}
