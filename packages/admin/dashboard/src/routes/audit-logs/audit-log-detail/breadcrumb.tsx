import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useAuditLog } from "../../../hooks/api/audit-logs"

type AuditLogDetailBreadcrumbProps = UIMatch<HttpTypes.AdminAuditLogResponse>

export const AuditLogDetailBreadcrumb = (
  props: AuditLogDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { audit_log } = useAuditLog(id!, undefined, {
    initialData: props.loaderData,
    enabled: Boolean(id),
  })

  if (!audit_log) {
    return null
  }

  return <span>{audit_log.action}</span>
}
