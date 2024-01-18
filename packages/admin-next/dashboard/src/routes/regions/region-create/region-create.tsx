import { FocusModal } from "@medusajs/ui"

import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CreateRegionForm } from "./components/create-region-form"

export const RegionCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <CreateRegionForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
