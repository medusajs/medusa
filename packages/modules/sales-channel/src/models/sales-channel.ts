import { model } from "@zjedene-medusa/framework/utils"

const SalesChannel = model.define("SalesChannel", {
  id: model.id({ prefix: "sc" }).primaryKey(),
  name: model.text().searchable(),
  description: model.text().searchable().nullable(),
  is_disabled: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default SalesChannel
