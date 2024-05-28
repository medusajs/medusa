import { ModuleProviderExports } from "@medusajs/types"
import { GoogleAuthService } from "./services/google"

const services = [GoogleAuthService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
