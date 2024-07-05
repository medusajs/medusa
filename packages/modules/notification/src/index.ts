import { NotificationModuleService } from "@services"
import loadProviders from "./loaders/providers"
import { Module, Modules } from "@medusajs/utils"

export default Module(Modules.NOTIFICATION, {
  service: NotificationModuleService,
  loaders: [loadProviders],
})
