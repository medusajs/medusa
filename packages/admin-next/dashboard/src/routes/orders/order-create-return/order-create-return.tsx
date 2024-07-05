import { useAdminOrder } from "medusa-react"
import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/route-modal"
import { CreateReturns } from "./components/order-create-return-form"

export function OrderCreateReturn() {
  const { id } = useParams()

  const { order, isLoading, isError, error } = useAdminOrder(id!, {
    expand:
      "items,items.variant,items.variant.product,returnable_items,claims,claims.additional_items,claims.return_order,swaps,swaps.additional_items",
  })

  if (isError) {
    throw error
  }

  const ready = !isLoading && order

  return (
    <RouteFocusModal>
      {ready && <CreateReturns order={order} />}
    </RouteFocusModal>
  )
}
