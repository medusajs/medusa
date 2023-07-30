import { LinkModuleService } from "@services"
import { ModuleJoinerConfig } from "@medusajs/types"

export function getModuleService(joinerConfig: ModuleJoinerConfig) {
  return class LinkService extends LinkModuleService<unknown> {
    __joinerConfig(): ModuleJoinerConfig {
      return joinerConfig as ModuleJoinerConfig
    }
  }
}

export function getReadOnlyModuleService(joinerConfig: ModuleJoinerConfig) {
  return class ReadOnlyLinkService {
    __joinerConfig(): ModuleJoinerConfig {
      return joinerConfig as ModuleJoinerConfig
    }
  }
}
