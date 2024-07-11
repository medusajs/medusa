import { RouteFocusModal } from "../../../components/modals"
import { CreateProductTypeForm } from "./components/create-product-type-form"

export const ProductTypeCreate = () => {
  return (
    <RouteFocusModal>
      <CreateProductTypeForm />
    </RouteFocusModal>
  )
}
