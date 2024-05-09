import { Response } from "@medusajs/medusa-js"
import { AdminCampaignResponse } from "@medusajs/types"
import { LoaderFunctionArgs } from "react-router-dom"
import { campaignsQueryKeys } from "../../../hooks/api/campaigns"
import { client } from "../../../lib/client"
import { queryClient } from "../../../lib/medusa"

const campaignDetailQuery = (id: string) => ({
  queryKey: campaignsQueryKeys.detail(id),
  queryFn: async () =>
    client.campaigns.retrieve(id, {
      fields: "+promotions.id",
    }),
})

export const campaignLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = campaignDetailQuery(id!)

  return (
    queryClient.getQueryData<Response<AdminCampaignResponse>>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}
