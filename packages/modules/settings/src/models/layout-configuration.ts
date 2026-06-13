import { model } from "@medusajs/framework/utils"

export const LayoutConfiguration = model
  .define("layout_configuration", {
    id: model.id({ prefix: "lyconf" }).primaryKey(),
    zone: model.text().searchable(),
    user_id: model.text().nullable(),
    is_system_default: model.boolean().default(false),
    configuration: model.json(),
  })
  .indexes([
    {
      on: ["zone", "user_id"],
      unique: true,
    },
    {
      on: ["zone", "is_system_default"],
    },
  ])
