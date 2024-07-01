import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { EditProductForm } from "./components/edit-product-form"

export const ProductEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("products.editProduct")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && product && <EditProductForm product={product} />}
    </RouteDrawer>
  )
}
