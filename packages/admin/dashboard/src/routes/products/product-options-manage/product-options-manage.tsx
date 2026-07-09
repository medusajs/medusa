import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useProduct } from "../../../hooks/api"
import { PRODUCT_DETAIL_FIELDS } from "../product-detail/constants"
import { ProductOptionsManageForm } from "./components/product-options-manage-form"

export const ProductOptionsManage = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product, isLoading, isError, error } = useProduct(id!, {
    fields: PRODUCT_DETAIL_FIELDS,
  })

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("products.options.manage.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("products.options.manage.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {!isLoading && product && <ProductOptionsManageForm product={product} />}
    </RouteDrawer>
  )
}
