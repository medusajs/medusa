import { defineMikroOrmCliConfig } from "@medusajs/utils"
import * as entities from "./src/models"

defineMikroOrmCliConfig({
  entities: Object.values(entities) as any[],
  databaseName: "medusa-currency",
})
