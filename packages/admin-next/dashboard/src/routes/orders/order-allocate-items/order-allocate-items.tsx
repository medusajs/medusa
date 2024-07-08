import { useParams } from "react-router-dom"

import { useOrder } from "../../../hooks/api/orders"
import { RouteFocusModal } from "../../../components/modals"
import { OrderAllocateItemsForm } from "./components/order-create-fulfillment-form"

export function OrderAllocateItems() {
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
      {ready && <OrderAllocateItemsForm order={order} />}
    </RouteFocusModal>
  )
}
