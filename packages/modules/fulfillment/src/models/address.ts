import { model } from "@zjedene-medusa/framework/utils"

export const FulfillmentAddress = model.define("fulfillment_address", {
  id: model.id({ prefix: "fuladdr" }).primaryKey(),
  company: model.text().nullable(),
  first_name: model.text().nullable(),
  last_name: model.text().nullable(),
  address_1: model.text().nullable(),
  address_2: model.text().nullable(),
  city: model.text().nullable(),
  country_code: model.text().nullable(),
  province: model.text().nullable(),
  postal_code: model.text().nullable(),
  phone: model.text().nullable(),
  metadata: model.json().nullable(),
})
