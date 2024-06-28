import { RouteFocusModal } from "../../../components/modals"
import { CreateInventoryItemForm } from "./components/create-inventory-item-form"

export function InventoryCreate() {
  return (
    <RouteFocusModal>
      <CreateInventoryItemForm />
    </RouteFocusModal>
  )
}
