import { ModuleProviderExports } from "@medusajs/types"
import { EmailPassAuthService } from "./services/emailpass"

const services = [EmailPassAuthService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
