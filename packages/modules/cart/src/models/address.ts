import { model } from "@zjedene-medusa/framework/utils"

const Address = model.define(
  { tableName: "cart_address", name: "Address" },
  {
    id: model.id({ prefix: "caaddr" }).primaryKey(),
    customer_id: model.text().nullable(),
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
  }
)

export default Address
