import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Heading } from "@medusajs/ui"

import { useOrder } from "../../../hooks/api/orders"
import { RouteDrawer } from "../../../components/modals"

import { OrderReceiveReturnForm } from "./components/order-receive-return-form"

export function OrderReceiveReturn() {
  const { id, return_id } = useParams()
  const { t } = useTranslation()

  const { order, isLoading, isError, error } = useOrder(id!)

  if (isError) {
    throw error
  }

  const ready = !isLoading && order

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.receiveReturn.title")}</Heading>
      </RouteDrawer.Header>
      {ready && <OrderReceiveReturnForm order={order} />}
    </RouteDrawer>
  )
}
