import { model } from "@medusajs/framework/utils"

import { ShippingOption } from "./shipping-option"

export const ShippingOptionType = model.define("shipping_option_type", {
  id: model.id({ prefix: "sotype" }).primaryKey(),
  label: model.text().searchable().translatable(),
  description: model.text().searchable().translatable().nullable(),
  code: model.text().searchable(),
  shipping_options: model.hasMany(() => ShippingOption, {
    mappedBy: "type",
  }),
})
