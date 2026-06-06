import { model } from "@zjedene-medusa/framework/utils"
import CustomerAddress from "./address"
import CustomerGroup from "./customer-group"
import CustomerGroupCustomer from "./customer-group-customer"

const Customer = model
  .define("Customer", {
    id: model.id({ prefix: "cus" }).primaryKey(),
    company_name: model.text().searchable().nullable(),
    first_name: model.text().searchable().nullable(),
    last_name: model.text().searchable().nullable(),
    email: model.text().searchable().nullable(),
    phone: model.text().searchable().nullable(),
    has_account: model.boolean().default(false),
    metadata: model.json().nullable(),
    created_by: model.text().nullable(),
    groups: model.manyToMany(() => CustomerGroup, {
      mappedBy: "customers",
      pivotEntity: () => CustomerGroupCustomer,
    }),
    addresses: model.hasMany(() => CustomerAddress, {
      mappedBy: "customer",
    }),
  })
  .cascades({
    delete: ["addresses"],
    detach: ["groups"],
  })
  .indexes([
    {
      on: ["email", "has_account"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default Customer
