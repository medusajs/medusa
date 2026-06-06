import * as entities from "./src/models"

import { defineMikroOrmCliConfig } from "@zjedene-medusa/framework/utils"

export default defineMikroOrmCliConfig("lockingPostgres", {
  entities: Object.values(entities),
})
