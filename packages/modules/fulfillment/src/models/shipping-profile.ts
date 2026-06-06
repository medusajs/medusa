import { model } from "@zjedene-medusa/framework/utils"

import { ShippingOption } from "./shipping-option"

export const ShippingProfile = model
  .define("shipping_profile", {
    id: model.id({ prefix: "sp" }).primaryKey(),
    name: model.text(),
    type: model.text(),
    shipping_options: model.hasMany(() => ShippingOption, {
      mappedBy: "shipping_profile",
    }),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["name"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])
