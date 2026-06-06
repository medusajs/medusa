import { model } from "@zjedene-medusa/framework/utils"

export const ViewConfiguration = model
  .define("view_configuration", {
    id: model.id({ prefix: "vconf" }).primaryKey(),
    entity: model.text().searchable(),
    name: model.text().searchable().nullable(),
    user_id: model.text().nullable(),
    is_system_default: model.boolean().default(false),
    configuration: model.json(),
  })
  .indexes([
    {
      on: ["entity", "user_id"],
    },
    {
      on: ["entity", "is_system_default"],
    },
    {
      on: ["user_id"],
    },
  ])
