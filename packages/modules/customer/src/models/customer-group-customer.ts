import { model } from "@zjedene-medusa/framework/utils"
import Customer from "./customer"
import CustomerGroup from "./customer-group"

const CustomerGroupCustomer = model.define("CustomerGroupCustomer", {
  id: model.id({ prefix: "cusgc" }).primaryKey(),
  created_by: model.text().nullable(),
  metadata: model.json().nullable(),
  customer: model.belongsTo(() => Customer, {
    mappedBy: "groups",
  }),
  customer_group: model.belongsTo(() => CustomerGroup, {
    mappedBy: "customers",
  }),
})

export default CustomerGroupCustomer
