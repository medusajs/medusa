import { model, ShippingOptionPriceType } from "@medusajs/framework/utils"

import { Fulfillment } from "./fulfillment"
import { FulfillmentProvider } from "./fulfillment-provider"
import { ServiceZone } from "./service-zone"
import { ShippingOptionRule } from "./shipping-option-rule"
import { ShippingOptionType } from "./shipping-option-type"
import { ShippingProfile } from "./shipping-profile"

export const ShippingOption = model
  .define("shipping_option", {
    id: model.id({ prefix: "so" }).primaryKey(),
    name: model.text().searchable().translatable(),
    price_type: model
      .enum(ShippingOptionPriceType)
      .default(ShippingOptionPriceType.FLAT),
    data: model.json().nullable(),
    metadata: model.json().nullable(),
    service_zone: model.belongsTo(() => ServiceZone, {
      mappedBy: "shipping_options",
    }),
    shipping_profile: model
      .belongsTo(() => ShippingProfile, {
        mappedBy: "shipping_options",
      })
      .nullable(),
    provider: model.belongsTo(() => FulfillmentProvider).nullable(),
    type: model.belongsTo(() => ShippingOptionType, {
      foreignKey: true,
      foreignKeyName: "shipping_option_type_id",
      mappedBy: "shipping_options",
    }),
    rules: model.hasMany(() => ShippingOptionRule, {
      mappedBy: "shipping_option",
    }),
    fulfillments: model.hasMany(() => Fulfillment, {
      mappedBy: "shipping_option",
    }),
  })
  .cascades({
    delete: ["rules"],
  })
