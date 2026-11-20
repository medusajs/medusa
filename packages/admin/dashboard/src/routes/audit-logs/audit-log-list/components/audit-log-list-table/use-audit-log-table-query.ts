import { HttpTypes } from "@medusajs/types"

import { parseFilterParam } from "../../../../../hooks/table/query"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import {
  AUDIT_LOG_LIST_FIELDS,
  AUDIT_LOG_PAGE_SIZE,
} from "../../../common/constants"

export const AUDIT_LOG_QUERY_KEYS = [
  "q",
  "order",
  "offset",
  "outcome",
  "actor_type",
  "action",
  "resource_type",
  "started_at",
] as const

type AuditLogQueryKey = (typeof AUDIT_LOG_QUERY_KEYS)[number]

export const buildAuditLogListParams = (
  raw: Partial<Record<AuditLogQueryKey, string | undefined>>
): HttpTypes.AdminAuditLogListParams => {
  const offset = raw.offset ? parseInt(raw.offset) : 0

  return {
    limit: AUDIT_LOG_PAGE_SIZE,
    offset: Number.isNaN(offset) ? 0 : offset,
    order: raw.order === "started_at" ? "started_at" : "-started_at",
    q: raw.q || undefined,
    outcome: parseFilterParam(raw.outcome),
    actor_type: parseFilterParam(raw.actor_type),
    action: parseFilterParam(raw.action),
    resource_type: parseFilterParam(raw.resource_type),
    started_at: parseFilterParam(raw.started_at),
    fields: AUDIT_LOG_LIST_FIELDS,
  }
}

export const useAuditLogTableQuery = () => {
  const raw = useQueryParams([...AUDIT_LOG_QUERY_KEYS])

  return { raw, searchParams: buildAuditLogListParams(raw) }
}
