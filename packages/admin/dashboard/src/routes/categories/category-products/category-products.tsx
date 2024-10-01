import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import { useProductCategory } from "../../../hooks/api/categories"
import { EditCategoryProductsForm } from "./components/edit-category-products-form"

export const CategoryProducts = () => {
  const { id } = useParams()

  const { product_category, isPending, isFetching, isError, error } =
    useProductCategory(id!, {
      fields: "products.id",
    })

  const ready = !isPending && !isFetching && !!product_category

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
