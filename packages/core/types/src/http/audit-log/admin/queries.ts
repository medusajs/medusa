import { AuditActorType, AuditOutcome } from "../../../audit"
import { SelectParams } from "../../common"

/**
 * A date range filter, with dates as ISO 8601 strings.
 */
export interface AdminAuditLogDateRange {
  /**
   * Later than this date.
   */
  $gt?: string
  /**
   * Later than or equal to this date.
   */
  $gte?: string
  /**
   * Earlier than this date.
   */
  $lt?: string
  /**
   * Earlier than or equal to this date.
   */
  $lte?: string
}

export interface AdminAuditLogListParams extends SelectParams {
  /**
   * The maximum number of audit logs to retrieve.
   */
  limit?: number
  /**
   * The number of audit logs to skip.
   */
  offset?: number
  /**
   * The sort order. Audit logs can only be sorted by `started_at`.
   *
   * @defaultValue `-started_at`
   */
  order?: "started_at" | "-started_at"
  /**
   * Search the action, resource type, resource ID, and actor ID for this text.
   */
  q?: string
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
  started_at?: AdminAuditLogDateRange
}

export interface AdminAuditLogParams extends SelectParams {}
