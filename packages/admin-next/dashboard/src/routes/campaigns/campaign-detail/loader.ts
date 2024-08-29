import { AdminCampaignResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"

import { campaignsQueryKeys } from "../../../hooks/api/campaigns"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const campaignDetailQuery = (id: string) => ({
  queryKey: campaignsQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.campaign.retrieve(id, {
      fields: "+promotions.id",
    }),
})

export const campaignLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = campaignDetailQuery(id!)

  return (
    queryClient.getQueryData<AdminCampaignResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
