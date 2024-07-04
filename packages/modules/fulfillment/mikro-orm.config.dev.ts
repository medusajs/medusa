import * as entities from "./src/models"
import { defineMikroOrmCliConfig, Modules } from "@medusajs/utils"

module.exports = defineMikroOrmCliConfig(Modules.FULFILLMENT, {
  entities: Object.values(entities),
})
