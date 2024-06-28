import { useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { ReturnCreateForm } from "./components/return-create-form"

import { useOrder } from "../../../hooks/api/orders"
import { DEFAULT_FIELDS } from "../order-detail/constants"

export const ReturnCreate = () => {
  const { id } = useParams()

  const { order, isLoading, isError, error } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && <ReturnCreateForm order={order} />}
    </RouteFocusModal>
  )
}
