import * as entities from "./src/models"
import { defineMikroOrmCliConfig, Modules } from "@medusajs/utils"

export default defineMikroOrmCliConfig(Modules.AUTH, {
  entities: Object.values(entities),
})
