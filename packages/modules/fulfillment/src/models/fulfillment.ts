import { model } from "@zjedene-medusa/framework/utils"

import { FulfillmentAddress } from "./address"
import { FulfillmentItem } from "./fulfillment-item"
import { FulfillmentLabel } from "./fulfillment-label"
import { FulfillmentProvider } from "./fulfillment-provider"
import { ShippingOption } from "./shipping-option"

export const Fulfillment = model
  .define("fulfillment", {
    id: model.id({ prefix: "ful" }).primaryKey(),
    location_id: model.text(),
    packed_at: model.dateTime().nullable(),
    shipped_at: model.dateTime().nullable(),
    marked_shipped_by: model.text().nullable(),
    created_by: model.text().nullable(),
    delivered_at: model.dateTime().nullable(),
    canceled_at: model.dateTime().nullable(),
    data: model.json().nullable(),
    requires_shipping: model.boolean().default(true),
    items: model.hasMany(() => FulfillmentItem, {
      mappedBy: "fulfillment",
    }),
    labels: model.hasMany(() => FulfillmentLabel, {
      mappedBy: "fulfillment",
    }),
    provider: model
      .hasOne(() => FulfillmentProvider, {
        foreignKey: true,
        mappedBy: undefined,
      })
      .nullable(),
    shipping_option: model
      .belongsTo(() => ShippingOption, {
        mappedBy: "fulfillments",
      })
      .nullable(),
    delivery_address: model
      .hasOne(() => FulfillmentAddress, {
        foreignKey: true,
        mappedBy: undefined,
      })
      .nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["location_id"],
      where: "deleted_at IS NULL",
    },
  ])
  .cascades({
    delete: ["delivery_address", "items", "labels"],
  })
