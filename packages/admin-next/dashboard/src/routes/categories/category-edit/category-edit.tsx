import { Drawer, Heading } from "@medusajs/ui"
import { useAdminProductCategory } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditCategoryForm } from "./components/edit-category-form"

export const CategoryEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!)
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const handleSuccessfulSubmit = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("categories.editCategory")}</Heading>
        </Drawer.Header>
        {!isLoading && product_category && (
          <EditCategoryForm
            category={product_category}
            onSuccessfulSubmit={handleSuccessfulSubmit}
            subscribe={subscribe}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
