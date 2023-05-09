import * as entities from "./src/models"

module.exports = {
  entities: Object.values(entities),
  schema: "public",
  dbName: "postgres://postgres@localhost/mikro-orm-medusa",
  type: "postgresql",
}
