import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../../../components/modals"
import { useInventoryItem } from "../../../../../hooks/api/inventory"
import { EditInventoryItemForm } from "./components/edit-item-form"

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
