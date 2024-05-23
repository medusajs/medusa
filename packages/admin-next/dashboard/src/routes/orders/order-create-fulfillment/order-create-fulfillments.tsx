import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { OrderCreateFulfillmentForm } from "./components/order-create-fulfillment-form"
import { useOrder } from "../../../hooks/api/orders"

export function OrderCreateFulfillment() {
  const { id } = useParams()

  const { order, isLoading, isError, error } = useOrder(id!, {
    fields: "currency_code,*items,*items.variant,*shipping_address",
  })

  if (isError) {
    throw error
  }

  const ready = !isLoading && order

  return (
    <RouteFocusModal>
      {ready && <OrderCreateFulfillmentForm order={order} />}
    </RouteFocusModal>
  )
}
