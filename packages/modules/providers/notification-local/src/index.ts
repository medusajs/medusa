import { ModuleProvider, Modules } from "@zjedene-medusa/framework/utils"
import { LocalNotificationService } from "./services/local"

const services = [LocalNotificationService]

export default ModuleProvider(Modules.NOTIFICATION, {
  services,
})
