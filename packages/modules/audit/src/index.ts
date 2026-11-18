import "./types"

import { Module, Modules } from "@medusajs/framework/utils"
import { AuditModuleService } from "@services"
import providersLoader from "./loaders/providers"

export default Module(Modules.AUDIT, {
  service: AuditModuleService,
  loaders: [providersLoader],
})

export type { AuditModuleOptions } from "./types"
export { MedusaAuditService } from "./providers"
export type { MedusaAuditProviderOptions } from "./providers"
export { PostgresAuditService } from "./providers"
