import { model } from "@zjedene-medusa/framework/utils"

import { ServiceZone } from "./service-zone"

export const FulfillmentSet = model
  .define("fulfillment_set", {
    id: model.id({ prefix: "fuset" }).primaryKey(),
    name: model.text(),
    type: model.text(),
    service_zones: model.hasMany(() => ServiceZone, {
      mappedBy: "fulfillment_set",
    }),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["name"],
      where: "deleted_at IS NULL",
      unique: true,
    },
  ])
  .cascades({
    delete: ["service_zones"],
  })
