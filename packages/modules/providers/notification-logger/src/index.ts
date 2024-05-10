import { ModuleProviderExports } from "@medusajs/types"
import { LoggerNotificationService } from "./services/logger"

const services = [LoggerNotificationService]

const providerExport: ModuleProviderExports = {
  services,
}

export default providerExport
