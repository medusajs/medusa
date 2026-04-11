import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { CreateProductOptionForm } from "./components/create-product-option-form"

export const ProductCreateOption = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useProduct(id!, {
    // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
    fields:
      "-type,-collection,-options,-tags,-images,-variants,-sales_channels",
  })

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
