import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import {
  CreateReservationReq,
  UpdateReservationReq,
} from "../../types/api-payloads"
import {
  ReservationItemDeleteRes,
  ReservationItemListRes,
  ReservationItemRes,
} from "../../types/api-responses"

import { InventoryTypes } from "@medusajs/types"
import { client } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { inventoryItemsQueryKeys } from "./inventory.tsx"

const RESERVATION_ITEMS_QUERY_KEY = "reservation_items" as const
export const reservationItemsQueryKeys = queryKeysFactory(
  RESERVATION_ITEMS_QUERY_KEY
)

export const useReservationItem = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<ReservationItemRes, Error, ReservationItemRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: reservationItemsQueryKeys.detail(id),
    queryFn: async () => client.reservations.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useReservationItems = (
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      ReservationItemListRes,
      Error,
      ReservationItemListRes,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.reservations.list(query),
    queryKey: reservationItemsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useUpdateReservationItem = (
  id: string,
  options?: UseMutationOptions<ReservationItemRes, Error, UpdateReservationReq>
) => {
  return useMutation({
    mutationFn: (payload: InventoryTypes.UpdateReservationItemInput) =>
      client.reservations.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useCreateReservationItem = (
  options?: UseMutationOptions<ReservationItemRes, Error, CreateReservationReq>
) => {
  return useMutation({
    mutationFn: (payload: CreateReservationReq) =>
      client.reservations.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteReservationItem = (
  id: string,
  options?: UseMutationOptions<ReservationItemDeleteRes, Error, void>
) => {
  return useMutation({
    mutationFn: () => client.reservations.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.lists(),
      })
      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.detail(id),
      })
      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.details(),
      })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}
