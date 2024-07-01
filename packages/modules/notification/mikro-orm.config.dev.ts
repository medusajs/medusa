import * as entities from "./src/models"
import { defineMikroOrmCliConfig } from "@medusajs/utils"

module.exports = defineMikroOrmCliConfig({
  entities: Object.values(entities),
  schema: "public",
  databaseName: "medusa-notification",
})
