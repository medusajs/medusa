import {
  AdminNotificationsRes,
  AdminPostNotificationsNotificationResendReq,
} from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminNotificationKeys } from "./queries"

/**
 * This hook resends a previously sent notifications, with the same data but optionally to a different address.
 *
 * @example
 * import React from "react"
 * import { useAdminResendNotification } from "medusa-react"
 *
 * type Props = {
 *   notificationId: string
 * }
 *
 * const Notification = ({ notificationId }: Props) => {
 *   const resendNotification = useAdminResendNotification(
 *     notificationId
 *   )
 *   // ...
 *
 *   const handleResend = () => {
 *     resendNotification.mutate({}, {
 *       onSuccess: ({ notification }) => {
 *         console.log(notification.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Notification
 *
 * @customNamespace Hooks.Admin.Notifications
 * @category Mutations
 */
export const useAdminResendNotification = (
  /**
   * The ID of the notification.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminNotificationsRes>,
    Error,
    AdminPostNotificationsNotificationResendReq
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminPostNotificationsNotificationResendReq) =>
      client.admin.notifications.resend(id, payload),
    ...buildOptions(
      queryClient,
      [adminNotificationKeys.lists(), adminNotificationKeys.detail(id)],
      options
    ),
  })
}
