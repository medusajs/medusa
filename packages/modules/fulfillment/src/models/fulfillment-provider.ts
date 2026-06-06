import { model } from "@zjedene-medusa/framework/utils"

export const FulfillmentProvider = model.define("fulfillment_provider", {
  id: model.id({ prefix: "serpro" }).primaryKey(),
  is_enabled: model.boolean().default(true),
})
