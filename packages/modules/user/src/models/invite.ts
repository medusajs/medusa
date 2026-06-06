import { model } from "@zjedene-medusa/framework/utils"

export const Invite = model
  .define("invite", {
    id: model.id({ prefix: "invite" }).primaryKey(),
    email: model.text().searchable(),
    accepted: model.boolean().default(false),
    token: model.text(),
    expires_at: model.dateTime(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["email"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      on: ["token"],
      where: "deleted_at IS NULL",
    },
  ])
