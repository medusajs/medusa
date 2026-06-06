import { model } from "@zjedene-medusa/framework/utils"

export const User = model
  .define("user", {
    id: model.id({ prefix: "user" }).primaryKey(),
    first_name: model.text().searchable().nullable(),
    last_name: model.text().searchable().nullable(),
    email: model.text().searchable(),
    avatar_url: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      unique: true,
      on: ["email"],
      where: "deleted_at IS NULL",
    },
  ])
