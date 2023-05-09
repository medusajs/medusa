import * as entities from "./src/models"

module.exports = {
  entities: Object.values(entities),
  schema: "public",
  dbName: "postgres://postgres@localhost/medusa-products",
  type: "postgresql",
}
