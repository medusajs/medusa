import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useProduct } from "../../../hooks/api/products"
import { CreateProductVariantForm } from "./components/create-product-variant-form"

export const ProductCreateVariant = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("products.variant.create.header")}</Heading>
      </RouteDrawer.Header>
      {!isLoading && product && <CreateProductVariantForm product={product} />}
    </RouteDrawer>
  )
}
