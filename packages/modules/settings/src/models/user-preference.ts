import { model } from "@zjedene-medusa/framework/utils"

export const UserPreference = model
  .define("user_preference", {
    id: model.id({ prefix: "usrpref" }).primaryKey(),
    user_id: model.text(),
    key: model.text().searchable(),
    value: model.json(),
  })
  .indexes([
    {
      on: ["user_id", "key"],
      unique: true,
    },
    {
      on: ["user_id"],
    },
  ])
