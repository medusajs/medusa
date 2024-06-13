import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { useProductCategory } from "../../../hooks/api/categories"
import { EditCategoryProductsForm } from "./components/edit-category-products-form"

export const CategoryProducts = () => {
  const { id } = useParams()

  const { product_category, isPending, isError, error } = useProductCategory(
    id!,
    {
      fields: "*products",
    }
  )

  const ready = !isPending && !!product_category

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && (
        <EditCategoryProductsForm
          categoryId={product_category.id}
          products={product_category.products}
        />
      )}
    </RouteFocusModal>
  )
}
