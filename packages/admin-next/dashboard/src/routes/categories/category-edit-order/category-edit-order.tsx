import { FocusModal } from "@medusajs/ui"
import { useAdminProductCategories } from "medusa-react"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { CategoryTree } from "./components/category-tree"

export const CategoryEditOrder = () => {
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { product_categories, isLoading, isError, error } =
    useAdminProductCategories({
      fields: "id,name,handle,rank,mpath",
      include_descendants_tree: true,
      parent_category_id: "null",
    })

  if (isError) {
    throw error
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Content>
        {product_categories && <CategoryTree categories={product_categories} />}
      </FocusModal.Content>
    </FocusModal>
  )
}
