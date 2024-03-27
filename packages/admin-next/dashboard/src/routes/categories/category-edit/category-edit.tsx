import { useAdminProductCategory } from "medusa-react"
import { useParams } from "react-router-dom"

import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { RouteDrawer } from "../../../components/route-modal"
import { EditCategoryForm } from "./components/edit-category-form"

export const CategoryEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!)

  const ready = !isLoading && !!product_category

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("categories.edit.header")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditCategoryForm category={product_category} />}
    </RouteDrawer>
  )
}
