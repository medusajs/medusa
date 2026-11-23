import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { SesNotificationService } from "./services/ses"

const services = [SesNotificationService]

export default ModuleProvider(Modules.NOTIFICATION, {
  services,
})
