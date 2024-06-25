import { model } from "@medusajs/utils"
import { Store } from "./index"

// TODO Re apply the index when available
/*const StoreCurrencyDeletedAtIndex = createPsqlIndexStatementHelper({
  tableName: "store_currency",
  columns: "deleted_at",
  where: "deleted_at IS NOT NULL",
})*/

const Currency = model.define("storeCurrency", {
  id: model.id({ prefix: "stocur" }),
  currency_code: model.text().searchable(),
  is_default: model.boolean().default(false),
  store: model.belongsTo(() => Store, { mappedBy: "supported_currencies" }),
})

export default Currency
