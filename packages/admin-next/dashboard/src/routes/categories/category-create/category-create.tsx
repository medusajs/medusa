import { useAdminProductCategories } from "medusa-react"
import { useLocation, useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { CreateCategoryForm } from "./components"

export const CategoryCreate = () => {
  const { id } = useParams()
  const { state } = useLocation()

  const pcat = id || state?.parent_id

  const { product_categories, isLoading, isError, error } =
    useAdminProductCategories({
      include_descendants_tree: true,
      parent_category_id: "null",
    })

  const ready = pcat ? !isLoading && !!product_categories : true

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {ready && (
        <CreateCategoryForm parentId={pcat} categories={product_categories} />
      )}
    </RouteFocusModal>
  )
}
