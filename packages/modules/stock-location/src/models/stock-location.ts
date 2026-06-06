import { model } from "@zjedene-medusa/framework/utils"
import StockLocationAddress from "./stock-location-address"

const StockLocation = model.define("StockLocation", {
  id: model.id({ prefix: "sloc" }).primaryKey(),
  name: model.text().searchable(),
  metadata: model.json().nullable(),
  address: model
    .belongsTo(() => StockLocationAddress, {
      mappedBy: "stock_locations",
    })
    .searchable()
    .nullable(),
})

export default StockLocation
