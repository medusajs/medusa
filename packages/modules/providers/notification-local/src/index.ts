import { ModuleProviderExports } from "@medusajs/types"
import loadSubscribers from "./loaders/index"
import { LocalNotificationService } from "./services/local"

const services = [LocalNotificationService]
const loaders = [loadSubscribers]

const providerExport: ModuleProviderExports = {
  services,
  loaders,
}

export default providerExport
