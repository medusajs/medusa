import {
  JoinerRelationship,
  ModuleExports,
  ModuleJoinerConfig,
} from "@medusajs/types"
import { getLoaders } from "../loaders"
import { getModuleService, getReadOnlyModuleService } from "../services"

export function getLinkModuleDefinition(
  joinerConfig: ModuleJoinerConfig,
  primary: JoinerRelationship,
  foreign: JoinerRelationship
): ModuleExports {
  return {
    service: joinerConfig.isReadOnlyLink
      ? getReadOnlyModuleService(joinerConfig)
      : getModuleService(joinerConfig),
    loaders: getLoaders({
      joinerConfig,
      primary,
      foreign,
    }),
  }
}
