import { ModuleProviderExports } from "@medusajs/framework/types"
import { PostgresAdvisoryLockProvider } from "./services/advisory-lock"

const services = [PostgresAdvisoryLockProvider]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
