import { FocusModal } from "@medusajs/ui"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { InviteUserForm } from "./components/invite-user-form/invite-user-form"

export const UserInvite = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        <InviteUserForm subscribe={subscribe} />
      </FocusModal.Content>
    </FocusModal>
  )
}
