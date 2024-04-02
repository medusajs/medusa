import { Heading } from "@medusajs/ui"
import { useAdminOrder } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/route-modal"
import { EditOrderEmailForm } from "./components/edit-order-email-form"
import { orderExpand } from "../order-detail/constants"

export const OrderEmail = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { order, isLoading, isError, error } = useAdminOrder(id!, {
    expand: orderExpand,
  })

  const ready = !isLoading && order

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("email.editHeader")}</Heading>
      </RouteDrawer.Header>
      {ready && <EditOrderEmailForm order={order} />}
    </RouteDrawer>
  )
}
