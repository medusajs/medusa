import { model } from "@medusajs/framework/utils"
import StoreCurrency from "./currency"
import StoreLocale from "./locale"

const Store = model
  .define("Store", {
    id: model.id({ prefix: "store" }).primaryKey(),
    name: model.text().default("Medusa Store").searchable(),
    default_sales_channel_id: model.text().nullable(),
    default_region_id: model.text().nullable(),
    default_location_id: model.text().nullable(),
    metadata: model.json().nullable(),
    supported_currencies: model.hasMany(() => StoreCurrency, {
      mappedBy: "store",
    }),
    /**
     * The supported locales of the store.
     * 
     * @since 2.12.3
     */
    supported_locales: model.hasMany(() => StoreLocale, {
      mappedBy: "store",
    }),
  })
  .cascades({
    delete: ["supported_currencies", "supported_locales"],
  })

export default Store
