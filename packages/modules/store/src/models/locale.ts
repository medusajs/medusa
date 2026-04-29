import { model } from "@medusajs/framework/utils"
import Store from "./store"

/**
 * @since 2.12.3
 */
const StoreLocale = model.define("StoreLocale", {
  id: model.id({ prefix: "stloc" }).primaryKey(),
  /**
   * The BCP 47 language tag code of the locale.
   * 
   * @example
   * "en-US"
   */
  locale_code: model.text().searchable(),
  store: model
    .belongsTo(() => Store, {
      mappedBy: "supported_locales",
    })
    .nullable(),
})

export default StoreLocale
