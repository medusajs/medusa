import { model } from "@zjedene-medusa/framework/utils"

const _OrderAddress = model
  .define("OrderAddress", {
    id: model.id({ prefix: "ordaddr" }).primaryKey(),
    customer_id: model.text().nullable(),
    company: model.text().searchable().nullable(),
    first_name: model.text().searchable().nullable(),
    last_name: model.text().searchable().nullable(),
    address_1: model.text().searchable().nullable(),
    address_2: model.text().searchable().nullable(),
    city: model.text().searchable().nullable(),
    country_code: model.text().nullable(),
    province: model.text().searchable().nullable(),
    postal_code: model.text().searchable().nullable(),
    phone: model.text().searchable().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_order_address_customer_id",
      on: ["customer_id"],
      unique: false,
    },
  ])

export const OrderAddress = _OrderAddress
