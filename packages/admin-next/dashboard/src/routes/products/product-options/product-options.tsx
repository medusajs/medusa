import { Drawer, Heading } from "@medusajs/ui"
import { useAdminProduct } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { useRouteModalState } from "../../../hooks/use-route-modal-state"
import { EditProductOptionsForm } from "./components/edit-product-options-form"

export const ProductOptions = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const [open, onOpenChange, subscribe] = useRouteModalState()

  const { product, isLoading, isError, error } = useAdminProduct(id!)

  const handleSuccess = () => {
    onOpenChange(false, true)
  }

  if (isError) {
    throw error
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>{t("products.editOptions")}</Heading>
        </Drawer.Header>
        {!isLoading && product && (
          <EditProductOptionsForm
            product={product}
            handleSuccess={handleSuccess}
            subscribe={subscribe}
          />
        )}
      </Drawer.Content>
    </Drawer>
  )
}
