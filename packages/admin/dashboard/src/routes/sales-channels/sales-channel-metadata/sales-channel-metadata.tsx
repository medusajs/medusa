import { useParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { MetadataForm } from "../../../components/forms/metadata-form"
import { useSalesChannel, useUpdateSalesChannel } from "../../../hooks/api"

export const SalesChannelMetadata = () => {
  const { id } = useParams()

  const {
    sales_channel: salesChannel,
    isPending,
    isError,
    error,
  } = useSalesChannel(id)
  const { mutateAsync, isPending: isMutating } = useUpdateSalesChannel(id)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <MetadataForm
        isPending={isPending}
        isMutating={isMutating}
        hook={mutateAsync}
        metadata={salesChannel?.metadata}
      />
    </RouteDrawer>
  )
}
