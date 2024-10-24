import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { TwilioNotificationService } from "./services/twilio"

const services = [TwilioNotificationService]

export default ModuleProvider(Modules.NOTIFICATION, {
  services,
})
