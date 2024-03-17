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

const ADMIN_RESERVATIONS_QUERY_KEY = `admin_reservations` as const

export const adminReservationsKeys = queryKeysFactory(
  ADMIN_RESERVATIONS_QUERY_KEY
)

type ReservationsQueryKeys = typeof adminReservationsKeys

/**
 * This hook retrieves a list of reservations. The reservations can be filtered by fields such as `location_id` or `quantity`
 * passed in the `query` parameter. The reservations can also be paginated.
 *
 * @example
 * To list reservations:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminReservations } from "medusa-react"
 *
 * const Reservations = () => {
 *   const { reservations, isLoading } = useAdminReservations()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {reservations && !reservations.length && (
 *         <span>No Reservations</span>
 *       )}
 *       {reservations && reservations.length > 0 && (
 *         <ul>
 *           {reservations.map((reservation) => (
 *             <li key={reservation.id}>{reservation.quantity}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Reservations
 * ```
 *
 * To specify relations that should be retrieved within the reservations:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminReservations } from "medusa-react"
 *
 * const Reservations = () => {
 *   const {
 *     reservations,
 *     isLoading
 *   } = useAdminReservations({
 *     expand: "location"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {reservations && !reservations.length && (
 *         <span>No Reservations</span>
 *       )}
 *       {reservations && reservations.length > 0 && (
 *         <ul>
 *           {reservations.map((reservation) => (
 *             <li key={reservation.id}>{reservation.quantity}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Reservations
 * ```
 *
 * By default, only the first `20` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminReservations } from "medusa-react"
 *
 * const Reservations = () => {
 *   const {
 *     reservations,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminReservations({
 *     expand: "location",
 *     limit: 10,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {reservations && !reservations.length && (
 *         <span>No Reservations</span>
 *       )}
 *       {reservations && reservations.length > 0 && (
 *         <ul>
 *           {reservations.map((reservation) => (
 *             <li key={reservation.id}>{reservation.quantity}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Reservations
 * ```
 *
 * @customNamespace Hooks.Admin.Reservations
 * @category Queries
 */
export const useAdminReservations = (
  /**
   * Filters and pagination parameters to apply on the retrieved reservations.
   */
  query?: AdminGetReservationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminReservationsListRes>,
    Error,
    ReturnType<ReservationsQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery({
    queryKey: adminReservationsKeys.list(query),
    queryFn: () => client.admin.reservations.list(query),
    ...options,
  })

  return { ...data, ...rest } as const
}

/**
 * This hook retrieves a reservation's details.
 *
 * @example
 * import React from "react"
 * import { useAdminReservation } from "medusa-react"
 *
 * type Props = {
 *   reservationId: string
 * }
 *
 * const Reservation = ({ reservationId }: Props) => {
 *   const { reservation, isLoading } = useAdminReservation(
 *     reservationId
 *   )
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {reservation && (
 *         <span>{reservation.inventory_item_id}</span>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Reservation
 *
 * @customNamespace Hooks.Admin.Reservations
 * @category Queries
 */
export const useAdminReservation = (
  /**
   * The reservation's ID.
   */
  id: string,
  options?: UseQueryOptionsWrapper<
    Response<AdminReservationsRes>,
    Error,
    ReturnType<ReservationsQueryKeys["detail"]>
  >
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery({
    queryKey: adminReservationsKeys.detail(id),
    queryFn: () => client.admin.reservations.retrieve(id),
    ...options,
  })

  return { ...data, ...rest } as const
}
