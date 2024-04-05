import { adminPublishableApiKeysKeys, useAdminCustomQuery } from "medusa-react"
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/route-modal"
import { AddSalesChannelsToApiKeyForm } from "./components"

export const ApiKeyManagementAddSalesChannels = () => {
  const { id } = useParams()

  const { data, isLoading, isError, error } = useAdminCustomQuery(
    `/api-keys/${id}`,
    [adminPublishableApiKeysKeys.detailSalesChannels(id!)],
    {
      fields: "id,*sales_channels",
    },
    {
      keepPreviousData: true,
    }
  )

  if (isError) {
    throw error
  }

  const salesChannels = data?.api_key?.sales_channels

  return (
    <RouteFocusModal>
      {!isLoading && salesChannels && (
        <AddSalesChannelsToApiKeyForm
          apiKey={id!}
          preSelected={salesChannels.map((sc) => sc.id)}
        />
      )}
    </RouteFocusModal>
  )
}
