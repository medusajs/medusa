import { Module, Modules } from "@medusajs/framework/utils"
import { MaterialModuleService } from "./services/material-module-service"

export default Module(Modules.MATERIAL, {
  service: MaterialModuleService,
})
