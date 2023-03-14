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

export const useAdminNotifications = (
  query?: AdminGetNotificationsParams,
  options?: UseQueryOptionsWrapper<
    Response<AdminNotificationsListRes>,
    Error,
    ReturnType<NotificationQueryKeys["list"]>
  >
) => {
  const { client } = useMedusa()
  const { data, ...rest } = useQuery(
    adminNotificationKeys.list(query),
    () => client.admin.notifications.list(query),
    options
  )
  return { ...data, ...rest } as const
}
