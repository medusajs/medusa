import { AuditActorType, AuditOutcome } from "../../../audit"

/**
 * The HTTP details of an audit log written for an API request.
 */
export interface AdminAuditLogRequest {
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
 */
export interface AdminAuditLog {
  /**
   * The audit log's ID.
   */
  id: string
  /**
   * When the action started, such as when the request arrived.
   */
  started_at: string
  /**
   * When the action ended, such as when the response was sent.
   */
  ended_at: string
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
   * How the action ended: `denied` for a 401 or 403 response, `failed` for any
   * other 4xx or 5xx response.
   */
  outcome: AuditOutcome
  /**
   * The HTTP details. `null` for an audit log written outside an API request.
   */
  request: AdminAuditLogRequest | null
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
