import { EditInventoryItemForm } from "./components/edit-item-form"
import { Heading } from "@medusajs/ui"
import { RouteDrawer } from "../../../../../components/route-modal"
import { useInventoryItem } from "../../../../../hooks/api/inventory"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const InventoryItemEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const {
    inventory_item: inventoryItem,
    isPending: isLoading,
    isError,
    error,
  } = useInventoryItem(id!)

  const ready = !isLoading && inventoryItem

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("inventory.editItemDetails")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditInventoryItemForm item={inventoryItem} />}
    </RouteDrawer>
  )
}
