import { useAdminProductCategory } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { CategoryAddProductsForm } from "./components/category-add-products-form/category-add-products-form"

export const CategoryAddProducts = () => {
  const { id } = useParams()

  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!)

  const ready = !isLoading && !!product_category

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && <CategoryAddProductsForm category={product_category} />}
    </RouteFocusModal>
  )
}
