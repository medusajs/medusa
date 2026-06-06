import { defineMikroOrmCliConfig, Modules } from "@zjedene-medusa/framework/utils"
import * as entities from "./src/models"

export default defineMikroOrmCliConfig(Modules.ORDER, {
  entities: Object.values(entities),
})
