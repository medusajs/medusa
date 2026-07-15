import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useProductOption } from "../../../hooks/api"
import { EditProductOptionForm } from "./components/edit-product-option-form"

export const ProductOptionEdit = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { product_option, isPending, isError, error } = useProductOption(id!)

  const ready = !isPending && !!product_option

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("productOptions.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("productOptions.edit.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && <EditProductOptionForm productOption={product_option} />}
    </RouteDrawer>
  )
}
