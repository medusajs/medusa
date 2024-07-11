import { model } from "@medusajs/utils"
import RegionCountry from "./country"

export default model.define("region", {
  id: model.id({ prefix: "reg" }).primaryKey(),
  name: model.text().searchable(),
  currency_code: model.text().searchable(),
  automatic_taxes: model.boolean().default(true),
  countries: model.hasMany(() => RegionCountry),
  metadata: model.json().nullable(),
})
