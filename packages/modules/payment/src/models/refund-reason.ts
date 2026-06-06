import { model } from "@zjedene-medusa/framework/utils"
import Refund from "./refund"

const RefundReason = model.define("RefundReason", {
  id: model.id({ prefix: "refr" }).primaryKey(),
  label: model.text().searchable().translatable(),
  code: model.text().searchable(),
  description: model.text().searchable().translatable().nullable(),
  metadata: model.json().nullable(),
  refunds: model.hasMany(() => Refund, {
    mappedBy: "refund_reason",
  }),
})

export default RefundReason
