import { defineMikroOrmCliConfig, Modules } from "@medusajs/framework/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig(Modules.PRODUCT, {
  entities: Object.values(entities),
})
