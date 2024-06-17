import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { useProductType } from "../../../hooks/api/product-types"
import { EditProductTypeForm } from "./components/edit-product-type-form"

export const ProductTypeEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product_type, isPending, isError, error } = useProductType(id!)

  const ready = !isPending && !!product_type

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("productTypes.edit.header")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditProductTypeForm productType={product_type} />}
    </RouteDrawer>
  )
}
