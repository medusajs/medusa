import * as entities from "./src/models"

import { defineMikroOrmCliConfig } from "@medusajs/framework/utils"

export default defineMikroOrmCliConfig("lockingPostgres", {
  entities: Object.values(entities),
})
