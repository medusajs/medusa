import { validateAndTransformQuery } from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { AdminGetAuditLogParams, AdminGetAuditLogsParams } from "./validators"

const readAuditLogs = authorize({
  resource: "audit_log",
  operation: PolicyOperation.read,
})

export const adminAuditLogRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/audit-logs",
    audit: false,
    middlewares: [
      readAuditLogs,
      validateAndTransformQuery(
        AdminGetAuditLogsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/audit-logs/:id",
    audit: false,
    middlewares: [
      readAuditLogs,
      validateAndTransformQuery(
        AdminGetAuditLogParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
