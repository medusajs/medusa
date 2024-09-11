import { defineMikroOrmCliConfig, Modules } from "@medusajs/utils"
import * as models from "@models"

export default defineMikroOrmCliConfig(Modules.INDEX, {
  entities: Object.values(models),
})
