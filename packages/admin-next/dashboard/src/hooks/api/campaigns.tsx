import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CreateCampaignReq, UpdateCampaignReq } from "../../types/api-payloads"
import {
  CampaignDeleteRes,
  CampaignListRes,
  CampaignRes,
} from "../../types/api-responses"

const REGIONS_QUERY_KEY = "campaigns" as const
const campaignsQueryKeys = queryKeysFactory(REGIONS_QUERY_KEY)

export const useCampaign = (
  id: string,
  options?: Omit<
    UseQueryOptions<CampaignRes, Error, CampaignRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: campaignsQueryKeys.detail(id),
    queryFn: async () => client.campaigns.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCampaigns = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<CampaignListRes, Error, CampaignListRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.campaigns.list(query),
    queryKey: campaignsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateCampaign = (
  options?: UseMutationOptions<CampaignRes, Error, CreateCampaignReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.campaigns.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateCampaign = (
  id: string,
  options?: UseMutationOptions<CampaignRes, Error, UpdateCampaignReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.campaigns.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteCampaign = (
  id: string,
  options?: UseMutationOptions<CampaignDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.campaigns.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
