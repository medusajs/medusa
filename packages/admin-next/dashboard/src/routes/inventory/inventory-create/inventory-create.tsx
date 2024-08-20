import { RouteFocusModal } from "../../../components/modals"
import { InventoryCreateForm } from "./components/inventory-create-form"

export function InventoryCreate() {
  return (
    <RouteFocusModal>
      <InventoryCreateForm />
    </RouteFocusModal>
  )
}
