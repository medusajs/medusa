import React from "react"
import {
  useAdminAddPublishableKeySalesChannelsBatch,
} from "medusa-react"

type Props = {
  publishableApiKeyId: string
}

const PublishableApiKey = ({
  publishableApiKeyId
}: Props) => {
  const addSalesChannels =
    useAdminAddPublishableKeySalesChannelsBatch(
      publishableApiKeyId
    )
  // ...

  const handleAdd = (salesChannelId: string) => {
    addSalesChannels.mutate({
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
