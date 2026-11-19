import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig("audit", {
  entities: Object.values(entities),
})
