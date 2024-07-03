import {
  AdminCampaignListResponse,
  AdminCampaignResponse,
  AdminCreateCampaign,
  AdminUpdateCampaign,
  LinkMethodRequest,
} from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CampaignDeleteRes } from "../../types/api-responses"
import { promotionsQueryKeys } from "./promotions"

const REGIONS_QUERY_KEY = "campaigns" as const
export const campaignsQueryKeys = queryKeysFactory(REGIONS_QUERY_KEY)

export const useCampaign = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminCampaignResponse,
      Error,
      AdminCampaignResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: campaignsQueryKeys.detail(id),
    queryFn: async () => client.campaigns.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCampaigns = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminCampaignListResponse,
      Error,
      AdminCampaignListResponse,
      QueryKey
    >,
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
  options?: UseMutationOptions<
    AdminCampaignResponse,
    Error,
    AdminCreateCampaign
  >
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
  options?: UseMutationOptions<
    AdminCampaignResponse,
    Error,
    AdminUpdateCampaign
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.campaigns.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details() })

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
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useAddOrRemoveCampaignPromotions = (
  id: string,
  options?: UseMutationOptions<AdminCampaignResponse, Error, LinkMethodRequest>
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.campaigns.addOrRemovePromotions(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details() })
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
