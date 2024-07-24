import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Heading } from "@medusajs/ui"

import { useOrder } from "../../../hooks/api/orders"
import { RouteDrawer } from "../../../components/modals"

import { OrderReceiveReturnForm } from "./components/order-receive-return-form"
import { useReturn } from "../../../hooks/api/returns"

export function OrderReceiveReturn() {
  const { id, return_id } = useParams()
  const { t } = useTranslation()

  const { order, isLoading, isError, error } = useOrder(id!)
  const { return: orderReturn } = useReturn(return_id, {
    fields: "*items.item,*items.item.variant,*items.item.variant.product",
  }) // TODO: fix API needs to return 404 if return not exists and not an empty object

  if (isError) {
    throw error
  }

  const ready = !isLoading && order && orderReturn

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>{t("orders.receiveReturn.title")}</Heading>
      </RouteDrawer.Header>
      {ready && (
        <OrderReceiveReturnForm order={order} orderReturn={orderReturn} />
      )}
    </RouteDrawer>
  )
}
