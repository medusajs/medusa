import { ModuleProviderExports } from "@medusajs/types"
import { LocalFileService } from "./services/local-file"

const services = [LocalFileService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
