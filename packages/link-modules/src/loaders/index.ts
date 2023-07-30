import { JoinerRelationship, ModuleJoinerConfig } from "@medusajs/types"

import { connectionLoader } from "./connection"
import { containerLoader } from "./container"
import { generateEntity } from "../utils"

export function getLoaders({
  joinerConfig,
  primary,
  foreign,
}: {
  joinerConfig: ModuleJoinerConfig
  primary: JoinerRelationship
  foreign: JoinerRelationship
}) {
  if (joinerConfig.isReadOnlyLink) {
    return []
  }

  const entity = generateEntity(joinerConfig, primary, foreign)
  return [connectionLoader(entity), containerLoader(entity, joinerConfig)]
}
