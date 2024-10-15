import { ModuleProviderExports } from "@medusajs/framework/types"
import { LocalFileService } from "./services/local-file"

const services = [LocalFileService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
