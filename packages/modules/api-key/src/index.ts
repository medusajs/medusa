import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { ApiKeyModuleService } from "@services"

export default Module(Modules.API_KEY, {
  service: ApiKeyModuleService,
})
