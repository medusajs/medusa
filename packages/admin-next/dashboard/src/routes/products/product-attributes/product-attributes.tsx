import { Heading } from "@medusajs/ui"
import { useAdminProduct } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { ProductAttributesForm } from "./components/product-attributes-form"

export const ProductAttributes = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("products.editAttributes")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && product && <ProductAttributesForm product={product} />}
    </RouteDrawer>
  )
}
