import { HttpTypes, LinkMethodRequest } from "@medusajs/types"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { promotionsQueryKeys } from "./promotions"
import { FetchError } from "@medusajs/js-sdk"

const REGIONS_QUERY_KEY = "campaigns" as const
export const campaignsQueryKeys = queryKeysFactory(REGIONS_QUERY_KEY)

export const useCampaign = (
  id: string,
  query?: HttpTypes.AdminGetCampaignParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCampaignResponse,
      FetchError,
      HttpTypes.AdminCampaignResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: campaignsQueryKeys.detail(id),
    queryFn: async () => sdk.admin.campaign.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCampaigns = (
  query?: HttpTypes.AdminGetCampaignsParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminCampaignListResponse,
      FetchError,
      HttpTypes.AdminCampaignListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.campaign.list(query),
    queryKey: campaignsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateCampaign = (
  options?: UseMutationOptions<
    HttpTypes.AdminCampaignResponse,
    FetchError,
    HttpTypes.AdminCreateCampaign
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.campaign.create(payload),
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
    HttpTypes.AdminCampaignResponse,
    FetchError,
    HttpTypes.AdminUpdateCampaign
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.campaign.update(id, payload),
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
  options?: UseMutationOptions<
    HttpTypes.DeleteResponse<"campaign">,
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.campaign.delete(id),
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
  options?: UseMutationOptions<
    HttpTypes.AdminCampaignResponse,
    FetchError,
    LinkMethodRequest
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.campaign.batchPromotions(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details() })
      queryClient.invalidateQueries({ queryKey: promotionsQueryKeys.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
