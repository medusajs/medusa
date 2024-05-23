import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { useSalesChannel } from "../../../hooks/api/sales-channels"
import { AddProductsToSalesChannelForm } from "./components"

export const SalesChannelAddProducts = () => {
  const { id } = useParams()
  const {
    sales_channel,
    isPending: isLoading,
    isError,
    error,
  } = useSalesChannel(id!)

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
