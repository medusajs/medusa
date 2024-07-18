import * as entities from "./src/models"

import { defineMikroOrmCliConfig, Modules } from "@medusajs/utils"

export default defineMikroOrmCliConfig(Modules.STOCK_LOCATION, {
  entities: Object.values(entities),
})
