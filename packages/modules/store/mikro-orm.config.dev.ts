import * as entities from "./src/models"
import { defineMikroOrmCliConfig } from "@medusajs/utils"

module.exports = defineMikroOrmCliConfig({
  entities: Object.values(entities),
  databaseName: "medusa-store",
})
