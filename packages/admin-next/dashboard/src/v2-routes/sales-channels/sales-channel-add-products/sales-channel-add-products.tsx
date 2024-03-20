import { useAdminSalesChannel } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { AddProductsToSalesChannelForm } from "./components"

export const SalesChannelAddProducts = () => {
  const { id } = useParams()
  const { sales_channel, isLoading, isError, error } = useAdminSalesChannel(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && sales_channel && (
        <AddProductsToSalesChannelForm salesChannel={sales_channel} />
      )}
    </RouteFocusModal>
  )
}
