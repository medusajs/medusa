import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { PostgresAdvisoryLockProvider } from "./services/advisory-lock"

const services = [PostgresAdvisoryLockProvider]

export default ModuleProvider(Modules.LOCKING, {
  services,
})
