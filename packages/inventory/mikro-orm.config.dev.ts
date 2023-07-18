import * as entities from "./src/models"

module.exports = {
  entities: Object.values(entities),
  schema: "public",
  clientUrl: "postgres://localhost/medusa-inventory",
  type: "postgresql",
}
