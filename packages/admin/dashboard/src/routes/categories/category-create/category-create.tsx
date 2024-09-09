import { useSearchParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { CreateCategoryForm } from "./components/create-category-form/create-category-form"

export const CategoryCreate = () => {
  const [searchParams] = useSearchParams()

  const parentCategoryId = searchParams.get("parent_category_id")

  return (
    <RouteFocusModal>
      <CreateCategoryForm parentCategoryId={parentCategoryId} />
    </RouteFocusModal>
  )
}
