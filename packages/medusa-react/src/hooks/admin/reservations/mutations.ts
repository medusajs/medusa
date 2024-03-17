import {
  AdminPostReservationsReq,
  AdminPostReservationsReservationReq,
  AdminReservationsDeleteRes,
  AdminReservationsRes,
} from "@medusajs/medusa"
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { Response } from "@medusajs/medusa-js"
import { useMedusa } from "../../../contexts"
import { buildOptions } from "../../utils/buildOptions"
import { adminInventoryItemsKeys } from "../inventory-item"
import { adminVariantKeys } from "../variants"
import { adminReservationsKeys } from "./queries"

/**
 * This hook creates a reservation which can be associated with any resource, such as an order's line item.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateReservation } from "medusa-react"
 *
 * const CreateReservation = () => {
 *   const createReservation = useAdminCreateReservation()
 *   // ...
 *
 *   const handleCreate = (
 *     locationId: string,
 *     inventoryItemId: string,
 *     quantity: number
 *   ) => {
 *     createReservation.mutate({
 *       location_id: locationId,
 *       inventory_item_id: inventoryItemId,
 *       quantity,
 *     }, {
 *       onSuccess: ({ reservation }) => {
 *         console.log(reservation.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateReservation
 *
 * @customNamespace Hooks.Admin.Reservations
 * @category Mutations
 */
export const useAdminCreateReservation = (
  options?: UseMutationOptions<
    Response<AdminReservationsRes>,
    Error,
    AdminPostReservationsReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostReservationsReq) =>
      client.admin.reservations.create(payload),
    ...buildOptions(
      queryClient,
      [adminReservationsKeys.lists(), adminVariantKeys.all],
      options
    ),
  })
}

/**
 * This hook updates a reservation's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateReservation } from "medusa-react"
 *
 * type Props = {
 *   reservationId: string
 * }
 *
 * const Reservation = ({ reservationId }: Props) => {
 *   const updateReservation = useAdminUpdateReservation(
 *     reservationId
 *   )
 *   // ...
 *
 *   const handleUpdate = (
 *     quantity: number
 *   ) => {
 *     updateReservation.mutate({
 *       quantity,
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Reservation
 *
 * @customNamespace Hooks.Admin.Reservations
 * @category Mutations
 */
export const useAdminUpdateReservation = (
  /**
   * The reservation's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminReservationsRes>,
    Error,
    AdminPostReservationsReservationReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostReservationsReservationReq) =>
      client.admin.reservations.update(id, payload),
    ...buildOptions(
      queryClient,
      [
        adminReservationsKeys.lists(),
        adminReservationsKeys.detail(id),
        adminVariantKeys.all,
        adminInventoryItemsKeys.details(),
      ],
      options
    ),
  })
}

/**
 * This hook deletes a reservation. Associated resources, such as the line item, will not be deleted.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteReservation } from "medusa-react"
 *
 * type Props = {
 *   reservationId: string
 * }
 *
 * const Reservation = ({ reservationId }: Props) => {
 *   const deleteReservation = useAdminDeleteReservation(
 *     reservationId
 *   )
 *   // ...
 *
 *   const handleDelete = () => {
 *     deleteReservation.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Reservation
 *
 * @customNamespace Hooks.Admin.Reservations
 * @category Mutations
 */
export const useAdminDeleteReservation = (
  /**
   * The reservation's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminReservationsDeleteRes>,
    Error,
    void
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.reservations.delete(id),
    ...buildOptions(
      queryClient,
      [
        adminReservationsKeys.lists(),
        adminReservationsKeys.detail(id),
        adminVariantKeys.all,
      ],
      options
    ),
  })
}
