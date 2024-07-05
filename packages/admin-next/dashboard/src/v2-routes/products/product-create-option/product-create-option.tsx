import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { CreateProductOptionForm } from "./components/create-product-option-form"
import { useProduct } from "../../../hooks/api/products"

export const ProductCreateOption = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("products.options.create.header")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && product && <CreateProductOptionForm product={product} />}
    </RouteDrawer>
  )
}
