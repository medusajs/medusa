import { Constructor, ILinkModule, ModuleJoinerConfig } from "@medusajs/types"
import { LinkModuleService } from "@services"

export function getModuleService(
  joinerConfig: ModuleJoinerConfig
): Constructor<ILinkModule> {
  const joinerConfig_ = JSON.parse(JSON.stringify(joinerConfig))
  const databaseConfig = joinerConfig_.databaseConfig

  delete joinerConfig_.databaseConfig

  // If extraDataFields is not defined, pick the fields to populate and validate from the
  // database config if any fields are provided.
  if (typeof joinerConfig_.extraDataFields === "undefined") {
    joinerConfig_.extraDataFields = Object.keys(
      databaseConfig.extraDataFields || {}
    )
  }

  return class LinkService extends LinkModuleService<unknown> {
    override __joinerConfig(): ModuleJoinerConfig {
      return joinerConfig_ as ModuleJoinerConfig
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
