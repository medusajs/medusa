import * as entities from "./src/models"
import { toMikroOrmEntities, TSMigrationGenerator } from "@medusajs/utils"

module.exports = {
  entities: toMikroOrmEntities(Object.values(entities)),
  schema: "public",
  clientUrl: "postgres://postgres@localhost/medusa-fulfillment",
  type: "postgresql",
  migrations: {
    generator: TSMigrationGenerator,
  },
}
