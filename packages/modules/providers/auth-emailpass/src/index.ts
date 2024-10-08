import { ModuleProviderExports } from "@medusajs/framework/types"
import { EmailPassAuthService } from "./services/emailpass"

const services = [EmailPassAuthService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
