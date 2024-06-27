import { model } from "@medusajs/utils"
import RegionCountry from "./country"

const Region = model.define("region", {
  id: model.id({ prefix: "reg" }),
  name: model.text(),
  currency_code: model.text(),
  automatic_taxes: model.boolean().default(true),
  countries: model.hasMany(() => RegionCountry),
  metadata: model.json().nullable(),
})

export default Region
