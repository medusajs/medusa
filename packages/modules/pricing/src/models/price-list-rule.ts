import { model } from "@zjedene-medusa/framework/utils"
import PriceList from "./price-list"

const PriceListRule = model
  .define("PriceListRule", {
    id: model.id({ prefix: "prule" }).primaryKey(),
    attribute: model.text(),
    value: model.json().nullable(),
    price_list: model.belongsTo(() => PriceList, {
      mappedBy: "price_list_rules",
    }),
  })
  .indexes([
    {
      on: ["price_list_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["attribute"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["value"],
      where: "deleted_at IS NULL",
      type: "gin",
    },
  ])

export default PriceListRule
