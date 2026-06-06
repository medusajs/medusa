import { model } from "@zjedene-medusa/framework/utils"
import { StockLocation } from "@models"

const StockLocationAddress = model
  .define("StockLocationAddress", {
    id: model.id({ prefix: "laddr" }).primaryKey(),
    address_1: model.text().searchable(),
    address_2: model.text().searchable().nullable(),
    company: model.text().nullable(),
    city: model.text().searchable().nullable(),
    country_code: model.text().searchable(),
    phone: model.text().nullable(),
    province: model.text().searchable().nullable(),
    postal_code: model.text().searchable().nullable(),
    metadata: model.json().nullable(),
    stock_locations: model.hasOne(() => StockLocation, {
      mappedBy: "address",
    }),
  })
  .cascades({
    delete: ["stock_locations"],
  })

export default StockLocationAddress
