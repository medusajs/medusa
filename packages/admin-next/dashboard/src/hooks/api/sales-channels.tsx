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
import {
  AddProductsSalesChannelReq,
  CreateSalesChannelReq,
  RemoveProductsSalesChannelReq,
  UpdateSalesChannelReq,
} from "../../types/api-payloads"
import { SalesChannelDeleteRes } from "../../types/api-responses"
import { productsQueryKeys } from "./products"
import {
  AdminSalesChannelListResponse,
  AdminSalesChannelResponse,
} from "@medusajs/types"

const SALES_CHANNELS_QUERY_KEY = "sales-channels" as const
export const salesChannelsQueryKeys = queryKeysFactory(SALES_CHANNELS_QUERY_KEY)

export const useSalesChannel = (
  id: string,
  options?: Omit<
    UseQueryOptions<
      AdminSalesChannelResponse,
      Error,
      AdminSalesChannelResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: salesChannelsQueryKeys.detail(id),
    queryFn: async () => client.salesChannels.retrieve(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useSalesChannels = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      AdminSalesChannelListResponse,
      Error,
      AdminSalesChannelListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.salesChannels.list(query),
    queryKey: salesChannelsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useCreateSalesChannel = (
  options?: UseMutationOptions<
    AdminSalesChannelResponse,
    Error,
    CreateSalesChannelReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.salesChannels.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateSalesChannel = (
  id: string,
  options?: UseMutationOptions<
    AdminSalesChannelResponse,
    Error,
    UpdateSalesChannelReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.salesChannels.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.detail(id),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteSalesChannel = (
  id: string,
  options?: UseMutationOptions<SalesChannelDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.salesChannels.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.detail(id),
      })

      // Invalidate all products to ensure they are updated if they were linked to the sales channel
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.all,
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useSalesChannelRemoveProducts = (
  id: string,
  options?: UseMutationOptions<
    AdminSalesChannelResponse,
    Error,
    RemoveProductsSalesChannelReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.salesChannels.removeProducts(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.detail(id),
      })

      // Invalidate the products that were removed
      for (const product of variables?.product_ids || []) {
        queryClient.invalidateQueries({
          queryKey: productsQueryKeys.detail(product),
        })
      }

      // Invalidate the products list query
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useSalesChannelAddProducts = (
  id: string,
  options?: UseMutationOptions<
    AdminSalesChannelResponse,
    Error,
    AddProductsSalesChannelReq
  >
) => {
  return useMutation({
    mutationFn: (payload) => client.salesChannels.addProducts(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: salesChannelsQueryKeys.detail(id),
      })

      // Invalidate the products that were removed
      for (const product of variables?.product_ids || []) {
        queryClient.invalidateQueries({
          queryKey: productsQueryKeys.detail(product),
        })
      }

      // Invalidate the products list query
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
