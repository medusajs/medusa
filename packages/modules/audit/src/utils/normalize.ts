import {
  AuditLogDTO,
  AuditLogRequest,
  AuditOutcome,
  CreateAuditLogDTO,
} from "@medusajs/framework/types"
import { generateEntityId, isObject } from "@medusajs/framework/utils"

export const AUDIT_LOG_ID_PREFIX = "audlog"

export const AUDIT_OUTCOMES: readonly AuditOutcome[] = [
  "succeeded",
  "denied",
  "failed",
]

export type NormalizeResult =
  | { entry: AuditLogDTO; error?: undefined }
  | { entry?: undefined; error: string }

/**
 * Turns caller input into a complete audit log with an ID. Returns the reason
 * instead of throwing, since `createAuditLogs` must never throw.
 */
export function normalizeAuditLog(
  input: CreateAuditLogDTO,
  now: Date = new Date()
): NormalizeResult {
  if (!isObject(input)) {
    return { error: "an audit log must be an object" }
  }

  const action = typeof input.action === "string" ? input.action.trim() : ""
  if (!action) {
    return { error: '"action" must be a non-empty string' }
  }

  const actorType = input.actor_type ?? "system"
  if (typeof actorType !== "string" || !actorType.trim()) {
    return { error: '"actor_type" must be a non-empty string' }
  }

  const outcome = input.outcome ?? "succeeded"
  if (!AUDIT_OUTCOMES.includes(outcome)) {
    return { error: `"outcome" must be one of ${AUDIT_OUTCOMES.join(", ")}` }
  }

  const startedAt = toDate(input.started_at ?? now)
  if (!startedAt) {
    return { error: '"started_at" must be a valid date' }
  }

  const endedAt = toDate(input.ended_at ?? startedAt)
  if (!endedAt) {
    return { error: '"ended_at" must be a valid date' }
  }

  return {
    entry: {
      id: generateEntityId(undefined, AUDIT_LOG_ID_PREFIX),
      started_at: startedAt,
      ended_at: endedAt,
      actor_type: actorType.trim(),
      actor_id: toNullableString(input.actor_id),
      impersonator_id: toNullableString(input.impersonator_id),
      action,
      resource_type: toNullableString(input.resource_type),
      resource_id: toNullableString(input.resource_id),
      outcome,
      request: toRequest(input.request),
      request_data: toNullableObject(input.request_data),
      response_data: toNullableObject(input.response_data),
      metadata: toNullableObject(input.metadata),
    },
  }
}

function toDate(value: unknown): Date | null {
  const date =
    value instanceof Date
      ? new Date(value.getTime())
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null

  return date && !Number.isNaN(date.getTime()) ? date : null
}

function toNullableString(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return null
  }

  return typeof value === "string" ? value : String(value)
}

function toNullableObject(value: unknown): Record<string, unknown> | null {
  return isObject(value) ? (value as Record<string, unknown>) : null
}

function toRequest(value: unknown): AuditLogRequest | null {
  if (!isObject(value)) {
    return null
  }

  const request = value as Partial<AuditLogRequest>
  const statusCode = Number(request.status_code)

  return {
    method: toNullableString(request.method) ?? "",
    route: toNullableString(request.route) ?? "",
    path: toNullableString(request.path) ?? "",
    status_code: Number.isFinite(statusCode) ? statusCode : 0,
    request_id: toNullableString(request.request_id),
    ip_address: toNullableString(request.ip_address),
    user_agent: toNullableString(request.user_agent),
  }
}
