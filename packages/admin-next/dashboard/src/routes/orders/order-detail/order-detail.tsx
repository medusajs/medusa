import { useAdminOrder } from "medusa-react"
import { useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { OrderGeneralSection } from "./components/order-general-section"

export const OrderDetail = () => {
  const { id } = useParams()

  const { order, isLoading, isError, error } = useAdminOrder(id!)

  if (isLoading || !order) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <OrderGeneralSection order={order} />
      <JsonViewSection data={order} />
    </div>
  )
}
