import { model } from "@medusajs/framework/utils"
import PaymentCollection from "./payment-collection"

const PaymentProvider = model.define("PaymentProvider", {
  id: model.id().primaryKey(),
  is_enabled: model.boolean().default(true),
  display_name: model.text().nullable(),
  payment_collections: model.manyToMany(() => PaymentCollection, {
    mappedBy: "payment_providers",
  }),
})

export default PaymentProvider
