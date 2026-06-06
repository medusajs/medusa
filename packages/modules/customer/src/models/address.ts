import { model } from "@zjedene-medusa/framework/utils"
import Customer from "./customer"

const CustomerAddress = model
  .define("CustomerAddress", {
    id: model.id({ prefix: "cuaddr" }).primaryKey(),
    address_name: model.text().searchable().nullable(),
    is_default_shipping: model.boolean().default(false),
    is_default_billing: model.boolean().default(false),
    company: model.text().searchable().nullable(),
    first_name: model.text().searchable().nullable(),
    last_name: model.text().searchable().nullable(),
    address_1: model.text().searchable().nullable(),
    address_2: model.text().searchable().nullable(),
    city: model.text().searchable().nullable(),
    country_code: model.text().nullable(),
    province: model.text().searchable().nullable(),
    postal_code: model.text().searchable().nullable(),
    phone: model.text().nullable(),
    metadata: model.json().nullable(),
    customer: model.belongsTo(() => Customer, {
      mappedBy: "addresses",
    }),
  })
  .indexes([
    {
      name: "IDX_customer_address_unique_customer_billing",
      on: ["customer_id"],
      unique: true,
      where: '"is_default_billing" = true',
    },
    {
      name: "IDX_customer_address_unique_customer_shipping",
      on: ["customer_id"],
      unique: true,
      where: '"is_default_shipping" = true',
    },
  ])

export default CustomerAddress
