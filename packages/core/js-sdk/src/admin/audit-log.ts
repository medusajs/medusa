import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class AuditLog {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method retrieves a paginated list of audit logs, newest first. It sends a
   * request to the List Audit Logs API route. The route is only available when
   * the Audit Module is installed.
   *
   * @param queryParams - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The paginated list of audit logs.
   *
   * @example
   * To retrieve the list of audit logs:
   *
   * ```ts
   * sdk.admin.auditLog.list()
   * .then(({ audit_logs, count, limit, offset }) => {
   *   console.log(audit_logs)
   * })
   * ```
   *
   * To retrieve the audit logs of a resource:
   *
   * ```ts
   * sdk.admin.auditLog.list({
   *   resource_type: "order",
   *   resource_id: "order_123",
   * })
   * .then(({ audit_logs, count, limit, offset }) => {
   *   console.log(audit_logs)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.auditLog.list({
   *   limit: 10,
   *   offset: 10,
   * })
   * .then(({ audit_logs, count, limit, offset }) => {
   *   console.log(audit_logs)
   * })
   * ```
   */
  async list(
    queryParams?: HttpTypes.AdminAuditLogListParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminAuditLogListResponse>(
      `/admin/audit-logs`,
      {
        query: queryParams,
        headers,
      }
    )
  }

  /**
   * This method retrieves an audit log by its ID. It sends a request to the
   * Get Audit Log API route. The route is only available when the Audit Module
   * is installed.
   *
   * @param id - The audit log's ID.
   * @param query - Configure the fields to retrieve in the audit log.
   * @param headers - Headers to pass in the request.
   * @returns The audit log's details.
   *
   * @example
   * sdk.admin.auditLog.retrieve("audlog_123")
   * .then(({ audit_log }) => {
   *   console.log(audit_log)
   * })
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminAuditLogParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminAuditLogResponse>(
      `/admin/audit-logs/${id}`,
      {
        query,
        headers,
      }
    )
  }
}
