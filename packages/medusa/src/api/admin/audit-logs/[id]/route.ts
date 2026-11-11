import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  AuditLogDTO,
  HttpTypes,
  IAuditModuleService,
} from "@medusajs/framework/types"
import { defineFileConfig, Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminAuditLogResponse>
) => {
  const auditModuleService = req.scope.resolve<IAuditModuleService>(
    Modules.AUDIT
  )

  const auditLog = await auditModuleService.retrieveAuditLog(req.params.id, {
    select: req.queryConfig.fields as (keyof AuditLogDTO)[],
  })

  res.json({ audit_log: auditLog as unknown as HttpTypes.AdminAuditLog })
}

defineFileConfig({
  isDisabled: () => !MedusaModule.isInstalled(Modules.AUDIT),
})
