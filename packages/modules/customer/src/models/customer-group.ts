import { model } from "@medusajs/framework/utils"
import Customer from "./customer"
import { CustomerGroupCustomer } from "@models"

const CustomerGroup = model
  .define("CustomerGroup", {
    id: model.id({ prefix: "cusgroup" }).primaryKey(),
    name: model.text().searchable().translatable(),
    metadata: model.json().nullable(),
    created_by: model.text().nullable(),
    customers: model.manyToMany(() => Customer, {
      mappedBy: "groups",
      pivotEntity: () => CustomerGroupCustomer,
    }),
  })
  .indexes([
    {
      on: ["name"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])
  .cascades({
    detach: ["customers"],
  })

export default CustomerGroup
