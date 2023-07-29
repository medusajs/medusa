import { JoinerRelationship, ModuleJoinerConfig } from "@medusajs/types"

import { connectionLoader } from "./connection"
import { containerLoader } from "./container"
import { generateEntity } from "../utils"

export function getLoaders({
  primary,
  foreign,
  joinerConfig,
}: {
  joinerConfig: ModuleJoinerConfig
  primary: JoinerRelationship
  foreign: JoinerRelationship
}) {
  const entity = generateEntity(primary, foreign)
  return [connectionLoader(entity), containerLoader(entity, joinerConfig)]
}
