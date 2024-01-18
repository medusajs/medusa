import { Drawer } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const UserEdit = () => {
  const [open, onOpenChange] = useRouteModalState()

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content></Drawer.Content>
    </Drawer>
  )
}
