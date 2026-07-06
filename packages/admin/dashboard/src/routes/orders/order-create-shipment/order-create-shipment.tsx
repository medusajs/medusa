import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useOrder } from "../../../hooks/api/orders"
import { OrderCreateShipmentForm } from "./components/order-create-shipment-form"
import { ExtendedOrder } from "../order-detail/constants"

export function OrderCreateShipment() {
  const { id, f_id } = useParams()

  const { order, isLoading, isError, error } = useOrder(id!, {
    fields:
      "*fulfillments,*fulfillments.items,*fulfillments.labels,no_notification",
  })

  if (isError) {
    throw error
  }

  const ready = !isLoading && order
  const extendedOrder = order as ExtendedOrder

  return (
    <RouteFocusModal>
      {ready && (
        <OrderCreateShipmentForm
          order={extendedOrder}
          fulfillment={extendedOrder.fulfillments?.find((f) => f.id === f_id)}
        />
      )}
    </RouteFocusModal>
  )
}
