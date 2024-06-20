import { AdjustInventoryForm } from "./components/adjust-inventory-form"
import { Heading } from "@medusajs/ui"
import { InventoryTypes } from "@medusajs/types"
import { RouteDrawer } from "../../../../../components/route-modal"
import { useInventoryItem } from "../../../../../hooks/api/inventory"
import { useParams } from "react-router-dom"
import { useStockLocation } from "../../../../../hooks/api/stock-locations"
import { useTranslation } from "react-i18next"

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
