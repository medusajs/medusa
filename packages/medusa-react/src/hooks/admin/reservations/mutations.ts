import {
  AdminPostReservationsReq,
  AdminPostReservationsReservationReq,
  AdminReservationsDeleteRes,
  AdminReservationsRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js/src"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminReservationsKeys } from "./queries"

export const useAdminCreateReservation = (
  options?: UseMutationOptions<
    Response<AdminReservationsRes>,
    Error,
    AdminPostReservationsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostReservationsReq) =>
      client.admin.reservations.create(payload),
    buildOptions(queryClient, [adminReservationsKeys.list()], options)
  )
}

export const useAdminUpdateReservation = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminReservationsRes>,
    Error,
    AdminPostReservationsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostReservationsReservationReq) =>
      client.admin.reservations.update(id, payload),
    buildOptions(
      queryClient,
      [adminReservationsKeys.lists(), adminReservationsKeys.detail(id)],
      options
    )
  )
}

export const useAdminDeleteReservation = (
  id: string,
  options?: UseMutationOptions<
    Response<AdminReservationsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.reservations.delete(id),
    buildOptions(
      queryClient,
      [adminReservationsKeys.lists(), adminReservationsKeys.detail(id)],
      options
    )
  )
}
