import { defineMikroOrmCliConfig, Modules } from "@medusajs/framework/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig(Modules.INDEX, {
  entities: Object.values(entities),
})
