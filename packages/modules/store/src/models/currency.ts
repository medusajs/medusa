import { model } from "@medusajs/utils"
import { Store } from "./index"

const Currency = model.define("storeCurrency", {
  id: model.id({ prefix: "stocur" }).primaryKey(),
  currency_code: model.text().searchable(),
  is_default: model.boolean().default(false),
  store: model.belongsTo(() => Store, { mappedBy: "supported_currencies" }),
})

export default Currency
