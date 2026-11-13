import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  AuditLogDTO,
  FilterableAuditLogProps,
  HttpTypes,
  IAuditModuleService,
} from "@medusajs/framework/types"
import { defineFileConfig, Modules } from "@medusajs/framework/utils"

/**
 * @ignore
 * TODO: remove the ignore tag and add a `@since` tag when the audit feature is fully released
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<undefined, FilterableAuditLogProps>,
  res: MedusaResponse<HttpTypes.AdminAuditLogListResponse>
) => {
  const auditModuleService = req.scope.resolve<IAuditModuleService>(
    Modules.AUDIT
  )
  const { skip, take, order } = req.queryConfig.pagination

  const [auditLogs, count] = await auditModuleService.listAndCountAuditLogs(
    req.filterableFields,
    {
      select: req.queryConfig.fields as (keyof AuditLogDTO)[],
      skip,
      take,
      order,
    }
  )

  res.json({
    audit_logs: auditLogs as unknown as HttpTypes.AdminAuditLog[],
    count,
    offset: skip,
    limit: take ?? auditLogs.length,
  })
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.AUDIT),
})
