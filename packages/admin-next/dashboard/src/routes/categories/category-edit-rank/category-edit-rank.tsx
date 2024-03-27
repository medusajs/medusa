import {
  useAdminProductCategories,
  useAdminProductCategory,
} from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { EditCategoryRankForm } from "./components/edit-category-postion-form"

export const CategoryEditPosition = () => {
  const { id } = useParams()

  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!)

  const {
    product_categories,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
  } = useAdminProductCategories({
    include_descendants_tree: true,
    parent_category_id: "null",
  })

  const ready = !isLoading && !!product_category

  if (isError) {
    throw error
  }

  if (isListError) {
    throw listError
  }

  return (
    <RouteFocusModal>
      {ready && (
        <EditCategoryRankForm
          isLoading={isListLoading}
          categories={product_categories}
          category={product_category}
        />
      )}
    </RouteFocusModal>
  )
}
