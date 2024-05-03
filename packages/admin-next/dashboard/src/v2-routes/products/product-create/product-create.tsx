import { RouteFocusModal } from "../../../components/route-modal"
import { ProductCreateForm } from "./components/product-create-form/product-create-form"

export const ProductCreate = () => {
  return (
    <RouteFocusModal>
      <ProductCreateForm />
    </RouteFocusModal>
  )
}
