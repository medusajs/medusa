import { model } from "@zjedene-medusa/framework/utils"
import Payment from "./payment"

const Capture = model
  .define("Capture", {
    id: model.id({ prefix: "capt" }).primaryKey(),
    amount: model.bigNumber(),
    payment: model.belongsTo(() => Payment, {
      mappedBy: "captures",
    }),
    metadata: model.json().nullable(),
    created_by: model.text().nullable(),
  })
  .indexes([
    {
      name: "IDX_capture_payment_id",
      on: ["payment_id"],
    },
  ])

export default Capture
