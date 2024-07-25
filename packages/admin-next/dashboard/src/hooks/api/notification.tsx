import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { HttpTypes } from "@medusajs/types"
import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const NOTIFICATION_QUERY_KEY = "notification" as const
export const notificationQueryKeys = queryKeysFactory(NOTIFICATION_QUERY_KEY)

export const useNotification = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminNotificationResponse,
      Error,
      HttpTypes.AdminNotificationResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: notificationQueryKeys.detail(id),
    queryFn: async () => sdk.admin.notification.retrieve(id, query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useNotifications = (
  query?: HttpTypes.AdminNotificationListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminNotificationListResponse,
      Error,
      HttpTypes.AdminNotificationListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.notification.list(query),
    queryKey: notificationQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}
