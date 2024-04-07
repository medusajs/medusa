import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { useSalesChannels } from "../../../hooks/api/sales-channels"
import { AddSalesChannelsToApiKeyForm } from "./components"

export const ApiKeyManagementAddSalesChannels = () => {
  const { id } = useParams()

  const { sales_channels, isLoading, isError, error } = useSalesChannels({
    publishable_key_id: id,
  })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && !!sales_channels && (
        <AddSalesChannelsToApiKeyForm
          apiKey={id!}
          preSelected={sales_channels.map((sc) => sc.id)}
        />
      )}
    </RouteFocusModal>
  )
}
