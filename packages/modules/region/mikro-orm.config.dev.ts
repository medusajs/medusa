import { defineMikroOrmCliConfig } from "@medusajs/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig({
  entities: Object.values(entities),
  databaseName: "medusa-region",
})