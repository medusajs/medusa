import { ModuleProviderExports } from "@medusajs/framework/types"
import { LocalNotificationService } from "./services/local"

const services = [LocalNotificationService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
