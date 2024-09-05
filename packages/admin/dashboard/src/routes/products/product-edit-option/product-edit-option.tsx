import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { json, useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useProduct } from "../../../hooks/api/products"
import { CreateProductOptionForm } from "./components/edit-product-option-form"

export const ProductEditOption = () => {
  const { id, option_id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useProduct(id!)

  const option = product?.options.find((o) => o.id === option_id)

  const ready = !isLoading && option

  if (!isLoading && !option) {
    throw json({ message: `An option with ID ${option_id} was not found` }, 404)
  }

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("products.options.edit.header")}</Heading>
      </RouteDrawer.Header>
      {ready && <CreateProductOptionForm option={option} />}
    </RouteDrawer>
  )
}
