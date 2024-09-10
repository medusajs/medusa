import { RouteFocusModal } from "../../../components/modals"
import { CreatePromotionForm } from "./components/create-promotion-form/create-promotion-form"

export const PromotionCreate = () => {
  return (
    <RouteFocusModal>
      <CreatePromotionForm />
    </RouteFocusModal>
  )
}
