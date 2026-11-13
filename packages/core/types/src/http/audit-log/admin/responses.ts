import { PaginatedResponse } from "../../common"
import { AdminAuditLog } from "./entities"

export interface AdminAuditLogResponse {
  /**
   * The audit log's details.
   */
  audit_log: AdminAuditLog
}

export type AdminAuditLogListResponse = PaginatedResponse<{
  /**
   * The list of audit logs.
   */
  audit_logs: AdminAuditLog[]
}>
