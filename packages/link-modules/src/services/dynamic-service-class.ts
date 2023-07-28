import { LinkModuleService } from "@services"
import { ModuleJoinerConfig } from "@medusajs/types"

export function getModuleService(joinerConfig: ModuleJoinerConfig) {
  return class Service extends LinkModuleService<unknown> {
    __joinerConfig(): ModuleJoinerConfig {
      return joinerConfig as ModuleJoinerConfig
    }
  }
}
