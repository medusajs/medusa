import { model } from "@zjedene-medusa/framework/utils"
import Price from "./price"

const PriceSet = model
  .define("PriceSet", {
    id: model.id({ prefix: "pset" }).primaryKey(),
    prices: model.hasMany(() => Price, {
      mappedBy: "price_set",
    }),
  })
  .cascades({
    delete: ["prices"],
  })

export default PriceSet
