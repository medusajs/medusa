import { useParams } from "react-router-dom"

import { AdminApiKeyResponse, AdminSalesChannelResponse } from "@medusajs/types"
import { RouteFocusModal } from "../../../components/route-modal"
import { useApiKey } from "../../../hooks/api/api-keys"
import { ApiKeyType } from "../common/constants"
import { ApiKeySalesChannelsFallback } from "./components/api-key-sales-channels-fallback"
import { ApiKeySalesChannelsForm } from "./components/api-key-sales-channels-form"

export const ApiKeyManagementAddSalesChannels = () => {
  const { id } = useParams()

  const { api_key, isLoading, isError, error } = useApiKey(id!)

  const isSecret = api_key?.type === ApiKeyType.SECRET
  const preSelected = (
    api_key as AdminApiKeyResponse["api_key"] & {
      sales_channels: AdminSalesChannelResponse["sales_channel"][] | null
    }
  )?.sales_channels?.map((sc) => sc.id)

  const ready = !isLoading && api_key && !isSecret

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {isSecret && <ApiKeySalesChannelsFallback />}
      {ready && (
        <ApiKeySalesChannelsForm apiKey={id!} preSelected={preSelected} />
      )}
    </RouteFocusModal>
  )
}
