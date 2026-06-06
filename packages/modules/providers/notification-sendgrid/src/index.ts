import { ModuleProvider, Modules } from "@zjedene-medusa/framework/utils"
import { SendgridNotificationService } from "./services/sendgrid"

const services = [SendgridNotificationService]

export default ModuleProvider(Modules.NOTIFICATION, {
  services,
})
