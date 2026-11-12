/**
 * Who performed the audited action.
 *
 * - `user`: an admin user.
 * - `api_key`: a secret API key.
 * - `customer`: a storefront customer.
 * - `system`: code that runs outside a request, such as a scheduled job.
 * - `anonymous`: an unauthenticated request, such as a failed login.
 */
export type AuditActorType =
  "user" | "api_key" | "customer" | "system" | "anonymous"

/**
 * How the audited action ended. `denied` is a 401 or 403 response, `failed`
 * any other 4xx or 5xx response.
 */
export type AuditOutcome = "succeeded" | "denied" | "failed"

/**
 * The HTTP details of an audit log written for an API request.
 */
export interface AuditLogRequest {
  /**
   * The HTTP method, such as `POST`.
   */
  method: string

  /**
   * The route pattern, such as `/admin/orders/:id/cancel`.
   */
  route: string

  /**
   * The request path without the query string.
   */
  path: string

  /**
   * The response status code.
   */
  status_code: number

  /**
   * The request ID, the same one that appears in the application logs.
   */
  request_id: string | null

  /**
   * The client IP address.
   */
  ip_address: string | null

  /**
   * The client user agent.
   */
  user_agent: string | null
}

/**
 * An audit log: one action, who performed it, on which resource, and how it ended.
 * Audit logs are only inserted and read, never updated or deleted.
 */
export interface AuditLogDTO {
  /**
   * The ID of the audit log, prefixed with `audlog_`.
   */
  id: string

  /**
   * When the action started, such as when the request arrived.
   */
  started_at: Date

  /**
   * When the action ended, such as when the response was sent.
   */
  ended_at: Date

  /**
   * The type of actor that performed the action.
   */
  actor_type: AuditActorType

  /**
   * The ID of the user, API key, or customer that performed the action.
   */
  actor_id: string | null

  /**
   * The ID of the Medusa staff member acting as the actor, on Medusa Cloud.
   */
  impersonator_id: string | null

  /**
   * The name of the action, such as `order.cancel` or `POST /admin/orders/:id/cancel`.
   */
  action: string

  /**
   * The type of resource acted on, such as `order`.
   */
  resource_type: string | null

  /**
   * The ID of the resource acted on. `null` when the action acts on several resources.
   */
  resource_id: string | null

  /**
   * How the action ended.
   */
  outcome: AuditOutcome

  /**
   * The HTTP details. `null` for an audit log written outside an API request.
   */
  request: AuditLogRequest | null

  /**
   * The request fields that the route chose to keep.
   */
  request_data: Record<string, unknown> | null

  /**
   * The response fields that the route chose to keep.
   */
  response_data: Record<string, unknown> | null

  /**
   * Any other data attached to the audit log.
   */
  metadata: Record<string, unknown> | null
}

/**
 * A date range filter. Dates can be passed as `Date` objects or ISO 8601 strings.
 */
export interface AuditLogDateRange {
  /**
   * Later than this date.
   */
  $gt?: Date | string

  /**
   * Later than or equal to this date.
   */
  $gte?: Date | string

  /**
   * Earlier than this date.
   */
  $lt?: Date | string

  /**
   * Earlier than or equal to this date.
   */
  $lte?: Date | string
}

/**
 * The filters to apply on retrieved audit logs. A filter given an array matches
 * any of its values.
 */
export interface FilterableAuditLogProps {
  /**
   * Filter by audit log IDs.
   */
  id?: string | string[]

  /**
   * Filter by actor types.
   */
  actor_type?: AuditActorType | AuditActorType[]

  /**
   * Filter by actor IDs.
   */
  actor_id?: string | string[]

  /**
   * Filter by actions.
   */
  action?: string | string[]

  /**
   * Filter by resource types.
   */
  resource_type?: string | string[]

  /**
   * Filter by resource IDs.
   */
  resource_id?: string | string[]

  /**
   * Filter by outcomes.
   */
  outcome?: AuditOutcome | AuditOutcome[]

  /**
   * Filter by when the action started.
   */
  started_at?: AuditLogDateRange

  /**
   * Search the action, resource type, resource ID, and actor ID for this text.
   * Providers are not required to support it.
   */
  q?: string
}

/**
 * Pagination, sorting, and field selection for retrieved audit logs.
 */
export interface AuditLogFindConfig {
  /**
   * The fields to return. All fields are returned when omitted. `id` is always returned.
   */
  select?: (keyof AuditLogDTO)[]

  /**
   * The number of audit logs to skip.
   */
  skip?: number | null

  /**
   * The maximum number of audit logs to return.
   *
   * @defaultValue 20
   */
  take?: number | null

  /**
   * The sort order. Audit logs can only be sorted by when they started.
   *
   * @defaultValue `{ started_at: "DESC" }`
   */
  order?: {
    started_at?: "ASC" | "DESC" | "asc" | "desc"
  }
}
