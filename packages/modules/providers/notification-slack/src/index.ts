import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { SlackNotificationService } from "./services/slack"

const services = [SlackNotificationService]

export default ModuleProvider(Modules.NOTIFICATION, {
  services,
})
