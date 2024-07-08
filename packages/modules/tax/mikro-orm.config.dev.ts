import { defineMikroOrmCliConfig, Modules } from "@medusajs/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig(Modules.TAX, {
  entities: Object.values(entities),
})
