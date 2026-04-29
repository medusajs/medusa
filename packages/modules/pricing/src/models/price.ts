import { model } from "@medusajs/framework/utils"
import PriceList from "./price-list"
import PriceRule from "./price-rule"
import PriceSet from "./price-set"

const Price = model
  .define("Price", {
    id: model.id({ prefix: "price" }).primaryKey(),
    title: model.text().nullable(),
    currency_code: model.text(),
    amount: model.bigNumber(),
    min_quantity: model.bigNumber().nullable(),
    max_quantity: model.bigNumber().nullable(),
    rules_count: model.number().default(0).nullable(),
    price_set: model.belongsTo(() => PriceSet, {
      mappedBy: "prices",
    }),
    price_rules: model.hasMany(() => PriceRule, {
      mappedBy: "price",
    }),
    price_list: model
      .belongsTo(() => PriceList, {
        mappedBy: "prices",
      })
      .nullable(),
  })
  .cascades({
    delete: ["price_rules"],
  })
  .indexes([
    {
      on: ["price_set_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["price_list_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["currency_code"],
      where: "deleted_at IS NULL",
    },
  ])

export default Price
