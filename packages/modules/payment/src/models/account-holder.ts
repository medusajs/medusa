import { model } from "@zjedene-medusa/framework/utils"

const AccountHolder = model
  .define("AccountHolder", {
    id: model.id({ prefix: "acchld" }).primaryKey(),
    provider_id: model.text(),
    external_id: model.text(),
    email: model.text().nullable(),
    data: model.json().default({}),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["provider_id", "external_id"],
      unique: true,
    },
  ])

export default AccountHolder
