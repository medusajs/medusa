import { useAdminOrder } from "medusa-react"
import { useParams } from "react-router-dom"

import { CreateClaim } from "./components/create-claims"
import { RouteFocusModal } from "../../../components/route-modal"

export function ClaimsCreate() {
  const { id } = useParams()

  const { order, isLoading, isError, error } = useAdminOrder(id!, {
    expand: "items,items.variant,items.variant.product,returnable_items",
  })

  if (isError) {
    throw error
  }

  if (isLoading || !order) {
    return null
  }

  return (
    <RouteFocusModal>
      <CreateClaim order={order} />
    </RouteFocusModal>
  )
}
