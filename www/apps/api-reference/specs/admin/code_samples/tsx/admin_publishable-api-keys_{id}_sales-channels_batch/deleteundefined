import React from "react"
import {
  useAdminRemovePublishableKeySalesChannelsBatch,
} from "medusa-react"

type Props = {
  publishableApiKeyId: string
}

const PublishableApiKey = ({
  publishableApiKeyId
}: Props) => {
  const deleteSalesChannels =
    useAdminRemovePublishableKeySalesChannelsBatch(
      publishableApiKeyId
    )
  // ...

  const handleDelete = (salesChannelId: string) => {
    deleteSalesChannels.mutate({
      sales_channel_ids: [
        {
          id: salesChannelId,
        },
      ],
    }, {
      onSuccess: ({ publishable_api_key }) => {
        console.log(publishable_api_key.id)
      }
    })
  }

  // ...
}

export default PublishableApiKey
