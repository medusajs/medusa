import { Heading } from "@medusajs/ui"
import { useAdminOrder } from "medusa-react"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/route-modal"
import { OrderRefundForm } from "./components/order-refund-form"
import { orderExpand } from "../order-detail/constants"

export const OrderRefund = () => {
  const { t } = useTranslation()

  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const paymentId = searchParams.get("paymentId")

  const { order, isLoading, isError, error } = useAdminOrder(id!, {
    expand: orderExpand,
  })

  const ready = !isLoading && order

  if (isError) {
    throw error
  }

  const payment = paymentId
    ? order.payments.find((p) => p.id === paymentId)
    : undefined

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.refund.title")}</Heading>
      </RouteDrawer.Header>
      {ready && <OrderRefundForm order={order} payment={payment} />}
    </RouteDrawer>
  )
}
