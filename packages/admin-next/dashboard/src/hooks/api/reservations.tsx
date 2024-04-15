import {
  AdminReservationListResponse,
  AdminReservationResponse,
  InventoryNext,
} from "@medusajs/types"
// import { CreateCustomerReq, UpdateCustomerReq } from "../../types/api-payloads"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { ReservationListRes, ReservationRes } from "../../types/api-responses"

import { client } from "../../lib/client"
import { inventoryItemsQueryKeys } from "./inventory"
import { queryClient } from "../../lib/medusa"
// import { queryClient } from "../../lib/medusa"
import { queryKeysFactory } from "../../lib/query-key-factory"

const RESERVATIONS_QUERY_KEY = "reservations" as const
export const reservationsQueryKeys = queryKeysFactory(RESERVATIONS_QUERY_KEY)

export const useReservation = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<ReservationRes, Error, ReservationRes, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: reservationsQueryKeys.detail(id),
    queryFn: async () => client.reservations.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

// // export const useReservations = (
// //   query?: Record<string, any>,
// //   options?: Omit<
// //     UseQueryOptions<ReservationListRes, Error, ReservationListRes, QueryKey>,
// //     "queryFn" | "queryKey"
// //   >
// // ) => {
// //   const { data, ...rest } = useQuery({
// //     queryFn: () => client.reservations.list(query),
// //     queryKey: reservationsQueryKeys.list(query),
// //     ...options,
// //   })

// //   return { ...data, ...rest }
// // }

// // export const useCreateCustomer = (
// //   options?: UseMutationOptions<AdminCustomerResponse, Error, CreateCustomerReq>
// // ) => {
// //   return useMutation({
// //     mutationFn: (payload) => client.customers.create(payload),
// //     onSuccess: (data, variables, context) => {
// //       queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.lists() })
// //       options?.onSuccess?.(data, variables, context)
// //     },
// //     ...options,
// //   })
// // }

// // export const useUpdateCustomer = (
// //   id: string,
// //   options?: UseMutationOptions<AdminCustomerResponse, Error, UpdateCustomerReq>
// // ) => {
// //   return useMutation({
// //     mutationFn: (payload) => client.customers.update(id, payload),
// //     onSuccess: (data, variables, context) => {
// //       queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.lists() })
// //       queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.detail(id) })

// //       options?.onSuccess?.(data, variables, context)
// //     },
// //     ...options,
// //   })
// // }
