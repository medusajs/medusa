import { useAdminPublishableApiKeySalesChannels } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { AddSalesChannelsToApiKeyForm } from "./components"

export const ApiKeyManagementAddSalesChannels = () => {
  const { id } = useParams()

  const { sales_channels, isLoading, isError, error } =
    useAdminPublishableApiKeySalesChannels(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {!isLoading && sales_channels && (
        <AddSalesChannelsToApiKeyForm
          apiKey={id!}
          preSelected={sales_channels.map((sc) => sc.id)}
        />
      )}
    </RouteFocusModal>
  )
}
