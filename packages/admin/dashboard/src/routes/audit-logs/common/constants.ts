export const AUDIT_LOG_PAGE_SIZE = 20

// request_data, response_data and metadata can be large, so the list leaves
// them to the detail page.
export const AUDIT_LOG_LIST_FIELDS =
  "id,started_at,actor_type,actor_id,impersonator_id,action,resource_type,resource_id,outcome"

export const AUDIT_LOG_OUTCOMES = ["succeeded", "denied", "failed"] as const
