import {
  AdminCampaignRes,
  AdminCampaignsListRes,
  AdminGetCampaignsCampaignParams,
  AdminGetCampaignsParams,
  AdminPostCampaignsCampaignReq,
} from "@medusajs/medusa"
import { useMutation } from "@tanstack/react-query"
import { queryKeysFactory, useAdminCustomQuery } from "medusa-react"
import { medusa } from "../medusa"

const QUERY_KEY = "admin_campaigns"
export const adminCampaignKeys = queryKeysFactory<
  typeof QUERY_KEY,
  AdminGetCampaignsParams
>(QUERY_KEY)

export const adminCampaignQueryFns = {
  list: (query: AdminGetCampaignsParams) =>
    medusa.admin.custom.get(`/admin/campaigns`, query),
  detail: (id: string) => medusa.admin.custom.get(`/admin/campaigns/${id}`),
}

export const useV2Campaigns = (
  query?: AdminGetCampaignsParams,
  options?: object
) => {
  const { data, ...rest } = useAdminCustomQuery<
    AdminGetCampaignsParams,
    AdminCampaignsListRes
  >("/admin/campaigns", adminCampaignKeys.list(query), query, options)

  return { ...data, ...rest }
}

export const useV2Campaign = (
  id: string,
  query?: AdminGetCampaignsParams,
  options?: object
) => {
  const { data, ...rest } = useAdminCustomQuery<
    AdminGetCampaignsCampaignParams,
    AdminCampaignRes
  >(`/admin/campaigns/${id}`, adminCampaignKeys.detail(id), query, options)

  return { ...data, ...rest }
}

export const useV2DeleteCampaign = (id: string) => {
  return useMutation(() => medusa.admin.custom.delete(`/admin/campaigns/${id}`))
}

export const useV2PostCampaign = (id: string) => {
  return useMutation((args: AdminPostCampaignsCampaignReq) =>
    medusa.client.request("POST", `/admin/campaigns/${id}`, args)
  )
}
