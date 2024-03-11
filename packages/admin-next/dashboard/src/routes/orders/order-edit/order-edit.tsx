import { useAdminOrder } from "medusa-react"
import { useLoaderData, useParams } from "react-router-dom"

import { orderLoader } from "./loader"
import { orderExpand } from "../order-detail/constants"
import { RouteFocusModal } from "../../../components/route-modal"
import { OrderEditForm } from "./components/order-edit-form"

export const OrderEdit = () => {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof orderLoader>>

  const { id } = useParams()

  const { order, isLoading, isError, error } = useAdminOrder(
    id!,
    {
      expand: orderExpand,
    },
    {
      initialData,
    }
  )

  if (isLoading || !order) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && order && <OrderEditForm order={order} />}
    </RouteFocusModal>
  )
}
