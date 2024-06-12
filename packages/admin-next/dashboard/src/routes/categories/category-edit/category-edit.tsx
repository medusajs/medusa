import { Heading } from "@medusajs/ui"

import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useProductCategory } from "../../../hooks/api/categories"
import { EditCategoryForm } from "./components/edit-category-form"

export const CategoryEdit = () => {
  const { id } = useParams()

  const { product_category, isPending, isError, error } = useProductCategory(
    id!
  )

  const ready = !isPending && !!product_category

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>Edit</Heading>
      </RouteDrawer.Header>
      {ready && <EditCategoryForm category={product_category} />}
    </RouteDrawer>
  )
}
