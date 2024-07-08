import * as entities from "./src/models"
import { defineMikroOrmCliConfig, Modules } from "@medusajs/utils"

export default defineMikroOrmCliConfig(Modules.PRODUCT, {
  entities: Object.values(entities),
  databaseName: "medusa-products",
})
