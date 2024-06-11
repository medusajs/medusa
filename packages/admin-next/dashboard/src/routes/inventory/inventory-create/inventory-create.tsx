import { RouteFocusModal } from "../../../components/route-modal"
import { CreateInventoryItemForm } from "./components/create-inventory-item-form"

export function InventoryCreate() {
  return (
    <RouteFocusModal>
      <CreateInventoryItemForm />
    </RouteFocusModal>
  )
}
