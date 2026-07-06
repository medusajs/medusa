import { ClientHeaders, FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query"
import { AdminCreateGiftCardType } from "../../../api/admin/gift-cards/validators"
import {
  AdminGetGiftCardsParams,
  AdminGiftCardResponse,
  AdminGiftCardsResponse,
  AdminUpdateGiftCardParams,
} from "../../../types"
import { queryKeysFactory } from "../../lib/query-key"
import { sdk } from "../../lib/sdk"
import { AdminOrderListResponse } from "@medusajs/framework/types"

const _giftCardQueryKey = queryKeysFactory("gift-card")

export const giftCardQueryKey = {
  ..._giftCardQueryKey,
  orders: (id: string) => [..._giftCardQueryKey.detail(id), "orders"],
}

export const useGiftCards = (
  query: AdminGetGiftCardsParams,
  options?: UseQueryOptions<
    AdminGiftCardsResponse,
    FetchError,
    AdminGiftCardsResponse,
    QueryKey
  >
) => {
  const fetchGiftCards = (
    query: AdminGetGiftCardsParams,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminGiftCardsResponse>(`/admin/gift-cards`, {
      query,
      headers,
    })

  const { data, ...rest } = useQuery({
    ...options,
    queryFn: () => fetchGiftCards(query)!,
    queryKey: giftCardQueryKey.list(query),
  })

  return { ...data, ...rest }
}

export const useGiftCard = (
  id: string,
  query?: AdminGetGiftCardsParams,
  options?: UseQueryOptions<
    AdminGiftCardResponse,
    FetchError,
    AdminGiftCardResponse,
    QueryKey
  >
) => {
  const fetchGiftCard = (
    id: string,
    query?: AdminGetGiftCardsParams,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminGiftCardResponse>(`/admin/gift-cards/${id}`, {
      query,
      headers,
    })

  const { data, ...rest } = useQuery({
    queryFn: () => fetchGiftCard(id, query),
    queryKey: giftCardQueryKey.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useGiftCardOrders = (
  id: string,
  options?: UseQueryOptions<
    AdminOrderListResponse,
    FetchError,
    AdminOrderListResponse,
    QueryKey
  >
) => {
  const fetchGiftCardOrders = (
    id: string,
    query?: AdminGetGiftCardsParams,
    headers?: ClientHeaders
  ) =>
    sdk.client.fetch<AdminOrderListResponse>(`/admin/gift-cards/${id}/orders`, {
      query,
      headers,
    })

  const { data, ...rest } = useQuery({
    queryFn: () => fetchGiftCardOrders(id),
    queryKey: giftCardQueryKey.orders(id),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateGiftCard = (
  id: string,
  options?: Omit<
    UseMutationOptions<
      AdminGiftCardResponse,
      FetchError,
      Omit<AdminUpdateGiftCardParams, "id">
    >,
    "mutationFn" | "mutationKey"
  >
) => {
  const queryClient = useQueryClient()

  const updateGiftCard = async (
    id: string,
    body: Omit<AdminUpdateGiftCardParams, "id">
  ) =>
    sdk.client.fetch<AdminGiftCardResponse>(`/admin/gift-cards/${id}`, {
      body,
      method: "POST",
    })

  return useMutation({
    mutationFn: async (payload) => updateGiftCard(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: giftCardQueryKey.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: giftCardQueryKey.lists(),
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteGiftCard = (
  id: string,
  options?: UseMutationOptions<AdminGiftCardResponse, FetchError, void>
) => {
  const queryClient = useQueryClient()

  const deleteGiftCard = async (id: string) =>
    sdk.client.fetch<AdminGiftCardResponse>(`/admin/gift-cards/${id}`, {
      method: "DELETE",
    })

  return useMutation({
    mutationFn: () => deleteGiftCard(id),
    onSuccess: (data: AdminGiftCardResponse, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: giftCardQueryKey.lists() })

      options?.onSuccess?.(data, variables, context)
    },
  })
}

export const useCreateGiftCard = (
  options?: UseMutationOptions<
    AdminGiftCardResponse,
    FetchError,
    AdminCreateGiftCardType
  >
) => {
  const queryClient = useQueryClient()
  const createGiftCard = async (body: AdminCreateGiftCardType) =>
    sdk.client.fetch<AdminGiftCardResponse>(`/admin/gift-cards`, {
      body,
      method: "POST",
    })

  return useMutation({
    mutationFn: (body: AdminCreateGiftCardType) => createGiftCard(body),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: giftCardQueryKey.lists() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
