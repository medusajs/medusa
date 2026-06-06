import { model } from "@zjedene-medusa/framework/utils"
import Cart from "./cart"

const CreditLine = model
  .define("CreditLine", {
    id: model.id({ prefix: "cacl" }).primaryKey(),
    cart: model.belongsTo(() => Cart, {
      mappedBy: "credit_lines",
    }),
    reference: model.text().nullable(),
    reference_id: model.text().nullable(),
    amount: model.bigNumber(),
    raw_amount: model.json(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_cart_credit_line_reference_reference_id",
      on: ["reference", "reference_id"],
      unique: false,
      where: "deleted_at IS NOT NULL",
    },
  ])

export default CreditLine
