import { Module, Modules } from "@medusajs/framework/utils"
import { OrganizationModuleService } from "./services/organization-module-service"

export default Module(Modules.ORGANIZATION, {
  service: OrganizationModuleService,
})
