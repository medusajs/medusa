import * as entities from "./src/models"
import { defineMikroOrmCliConfig, Modules } from "@medusajs/utils"

export default defineMikroOrmCliConfig(Modules.PRICING, {
  entities: Object.values(entities),
})
