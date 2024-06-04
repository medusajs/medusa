import { AdminApiKeyListResponse, AdminApiKeyResponse } from "@medusajs/types"
import {
  MutationOptions,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { CreateApiKeyReq, UpdateApiKeyReq } from "../../types/api-payloads"
import { ApiKeyDeleteRes } from "../../types/api-responses"
import { salesChannelsQueryKeys } from "./sales-channels"

const API_KEYS_QUERY_KEY = "api_keys" as const
export const apiKeysQueryKeys = queryKeysFactory(API_KEYS_QUERY_KEY)

export const useApiKey = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<AdminApiKeyResponse, Error, AdminApiKeyResponse, QueryKey>,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.apiKeys.retrieve(id, query),
    queryKey: apiKeysQueryKeys.detail(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useApiKeys = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminApiKeyListResponse,
      Error,
      AdminApiKeyListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.apiKeys.list(query),
    queryKey: apiKeysQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateApiKey = (
  options?: UseMutationOptions<AdminApiKeyResponse, Error, CreateApiKeyReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.apiKeys.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.lists() })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateApiKey = (
  id: string,
  options?: UseMutationOptions<AdminApiKeyResponse, Error, UpdateApiKeyReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.apiKeys.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useRevokeApiKey = (
  id: string,
  options?: UseMutationOptions<AdminApiKeyResponse, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.apiKeys.revoke(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
  })
}

export const useDeleteApiKey = (
  id: string,
  options?: MutationOptions<ApiKeyDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.apiKeys.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.detail(id) })

      options?.onSuccess?.(data, variables, context)
    },
  })
}

export const useBatchRemoveSalesChannelsFromApiKey = (
  id: string,
  options?: UseMutationOptions<
    AdminApiKeyResponse,
    Error,
    { sales_channel_ids: string[] }
  >
) => {
  return useMutation({
    mutationFn: (payload) =>
      client.apiKeys.batchRemoveSalesChannels(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.detail(id) })
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useBatchAddSalesChannelsToApiKey = (
  id: string,
  options?: UseMutationOptions<
    AdminApiKeyResponse,
    Error,
    { sales_channel_ids: string[] }
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.apiKeys.batchAddSalesChannels(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: apiKeysQueryKeys.detail(id) })
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
