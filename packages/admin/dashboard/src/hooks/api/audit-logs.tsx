import { FetchError } from "@medusajs/js-sdk"
import { HttpTypes } from "@medusajs/types"
import { QueryKey, UseQueryOptions, useQuery } from "@tanstack/react-query"

import { sdk } from "../../lib/client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const AUDIT_LOGS_QUERY_KEY = "audit_logs" as const
export const auditLogsQueryKeys = queryKeysFactory(AUDIT_LOGS_QUERY_KEY)

export const useAuditLogs = (
  query?: HttpTypes.AdminAuditLogListParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminAuditLogListResponse,
      FetchError,
      HttpTypes.AdminAuditLogListResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.auditLog.list(query),
    queryKey: auditLogsQueryKeys.list(query),
    ...options,
  })

  return { ...data, ...rest }
}

export const useAuditLog = (
  id: string,
  query?: HttpTypes.AdminAuditLogParams,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminAuditLogResponse,
      FetchError,
      HttpTypes.AdminAuditLogResponse,
      QueryKey
    >,
    "queryKey" | "queryFn"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => sdk.admin.auditLog.retrieve(id, query),
    queryKey: auditLogsQueryKeys.detail(id, query),
    ...options,
  })

  return { ...data, ...rest }
}
