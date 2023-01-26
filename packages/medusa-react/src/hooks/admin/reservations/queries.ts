import {
  AdminGetReservationsParams,
  AdminReservationsListRes,
  AdminReservationsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils"

const ADMIN_RESERVATIONS_QUERY_KEY = `admin_stock_locations` as const

export const adminReservationsKeys = queryKeysFactory(
  ADMIN_RESERVATIONS_QUERY_KEY
)

type ReservationsQueryKeys = typeof adminReservationsKeys

export const useAdminReservations = (
  query?: AdminGetReservationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminReservationsListRes>,
    Error,
    ReturnType<ReservationsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    adminReservationsKeys.list(query),
    () => client.admin.reservations.list(query),
    { ...options }
  )

  return { ...data, ...rest } as const
}

export const useAdminReservation = (
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminReservationsRes>,
    Error,
    ReturnType<ReservationsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    adminReservationsKeys.detail(id),
    () => client.admin.reservations.retrieve(id),
    options
  )

  return { ...data, ...rest } as const
}
