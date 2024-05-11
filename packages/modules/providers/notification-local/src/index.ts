import { ModuleProviderExports } from "@medusajs/types"
import { LocalNotificationService } from "./services/local"

const services = [LocalNotificationService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
