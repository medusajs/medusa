import { FocusModal } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"

export const ProductCreate = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { t } = useTranslation()

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content></FocusModal.Content>
    </FocusModal>
  )
}
