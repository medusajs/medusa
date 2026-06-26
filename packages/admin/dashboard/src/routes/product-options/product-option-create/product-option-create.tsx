import { RouteFocusModal } from "../../../components/modals"
import { CreateProductOptionForm } from "./components/create-product-option-form/create-product-option-form"

export const ProductOptionCreate = () => {
  return (
    <RouteFocusModal>
      <CreateProductOptionForm />
    </RouteFocusModal>
  )
}
