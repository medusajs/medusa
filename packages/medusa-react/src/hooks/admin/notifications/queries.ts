import {
  AdminGetNotificationsParams,
  AdminNotificationsListRes,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import { useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"
import { queryKeysFactory } from "../../utils/index"

const ADMIN_NOTIFICATIONS_QUERY_KEY = `admin_notifications` as const

export const adminNotificationKeys = queryKeysFactory(
  ADMIN_NOTIFICATIONS_QUERY_KEY
)

type NotificationQueryKeys = typeof adminNotificationKeys

/**
 * This hook retrieves a list of notifications. The notifications can be filtered by fields such as `event_name` or `resource_type` passed in the `query` parameter.
 * The notifications can also be paginated.
 *
 * @example
 * To list notifications:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminNotifications } from "medusa-react"
 *
 * const Notifications = () => {
 *   const { notifications, isLoading } = useAdminNotifications()
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {notifications && !notifications.length && (
 *         <span>No Notifications</span>
 *       )}
 *       {notifications && notifications.length > 0 && (
 *         <ul>
 *           {notifications.map((notification) => (
 *             <li key={notification.id}>{notification.to}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Notifications
 * ```
 *
 * To specify relations that should be retrieved within the notifications:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminNotifications } from "medusa-react"
 *
 * const Notifications = () => {
 *   const { notifications, isLoading } = useAdminNotifications({
 *     expand: "provider"
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {notifications && !notifications.length && (
 *         <span>No Notifications</span>
 *       )}
 *       {notifications && notifications.length > 0 && (
 *         <ul>
 *           {notifications.map((notification) => (
 *             <li key={notification.id}>{notification.to}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Notifications
 * ```
 *
 * By default, only the first `50` records are retrieved. You can control pagination by specifying the `limit` and `offset` properties:
 *
 * ```tsx
 * import React from "react"
 * import { useAdminNotifications } from "medusa-react"
 *
 * const Notifications = () => {
 *   const {
 *     notifications,
 *     limit,
 *     offset,
 *     isLoading
 *   } = useAdminNotifications({
 *     expand: "provider",
 *     limit: 20,
 *     offset: 0
 *   })
 *
 *   return (
 *     <div>
 *       {isLoading && <span>Loading...</span>}
 *       {notifications && !notifications.length && (
 *         <span>No Notifications</span>
 *       )}
 *       {notifications && notifications.length > 0 && (
 *         <ul>
 *           {notifications.map((notification) => (
 *             <li key={notification.id}>{notification.to}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   )
 * }
 *
 * export default Notifications
 * ```
 *
 * @customNamespace Hooks.Admin.Notifications
 * @category Queries
 */
export const useAdminNotifications = (
  /**
   * Filters and pagination configurations applied to the retrieved notifications.
   */
  query?: AdminGetNotificationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminNotificationsListRes>,
    Error,
    ReturnType<NotificationQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery({
    queryKey: adminNotificationKeys.list(query),
    queryFn: () => client.admin.notifications.list(query),
    ...options,
  })
  return { ...data, ...rest } as const
}
