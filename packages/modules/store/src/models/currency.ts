import { model } from "@zjedene-medusa/framework/utils"
import Store from "./store"

const StoreCurrency = model.define("StoreCurrency", {
  id: model.id({ prefix: "stocur" }).primaryKey(),
  currency_code: model.text().searchable(),
  is_default: model.boolean().default(false),
  store: model
    .belongsTo(() => Store, {
      mappedBy: "supported_currencies",
    })
    .nullable(),
})

export default StoreCurrency
