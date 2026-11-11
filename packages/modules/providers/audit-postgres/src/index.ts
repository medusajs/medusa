import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { PostgresAuditService } from "./services/postgres-audit"

const services = [PostgresAuditService]

export default ModuleProvider(Modules.AUDIT, {
  services,
})

export { PostgresAuditService }
export type { PostgresAuditProviderOptions } from "./services/postgres-audit"
