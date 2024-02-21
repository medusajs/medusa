import { Drawer, Heading } from "@medusajs/ui"
import { useAdminProduct } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditProductOptionsForm } from "./components/edit-product-options-form"

export const ProductOptions = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <Drawer.Header>
        <Heading>{t("products.editOptions")}</Heading>
      </Drawer.Header>
      {!isLoading && product && <EditProductOptionsForm product={product} />}
    </RouteDrawer>
  )
}
