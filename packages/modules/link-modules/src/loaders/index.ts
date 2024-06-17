import {
  JoinerRelationship,
  ModuleJoinerConfig,
  ModuleLoaderFunction,
} from "@medusajs/types"

import { generateEntity } from "../utils"
import { connectionLoader } from "./connection"
import { containerLoader } from "./container"

export function getLoaders({
  joinerConfig,
  primary,
  foreign,
}: {
  joinerConfig: ModuleJoinerConfig
  primary: JoinerRelationship
  foreign: JoinerRelationship
}): ModuleLoaderFunction[] {
  if (joinerConfig.isReadOnlyLink) {
    return []
  }

  const entity = generateEntity(joinerConfig, primary, foreign)
  return [connectionLoader(entity), containerLoader(entity, joinerConfig)]
}
