import * as InventoryModels from "./src/models"

module.exports = {
  entities: Object.values(InventoryModels),
  schema: "public",
  clientUrl: "postgres://localhost/medusa-inventory",
  type: "postgresql",
}
