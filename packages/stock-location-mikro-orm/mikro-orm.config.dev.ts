import * as StockModels from "./src/models"

module.exports = {
  entities: Object.values(StockModels),
  schema: "public",
  clientUrl: "postgres://postgres@localhost/medusa-stock-location",
  type: "postgresql",
  tsNode: true,
}
