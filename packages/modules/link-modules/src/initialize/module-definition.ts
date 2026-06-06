import {
  JoinerRelationship,
  ModuleExports,
  ModuleJoinerConfig,
} from "@zjedene-medusa/framework/types"
import { getModuleService, getReadOnlyModuleService } from "@services"
import { getLoaders } from "../loaders"

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
