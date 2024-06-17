import { TSMigrationGenerator } from "@mikro-orm/migrations"
import * as entities from "./src/models"

module.exports = {
  entities: Object.values(entities),
  schema: "public",
  clientUrl: "postgres://postgres@localhost/medusa-products",
  type: "postgresql",
  migrations: {
    generator: TSMigrationGenerator,
  },
}
