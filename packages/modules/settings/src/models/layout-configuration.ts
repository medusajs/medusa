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
    // Enforce at most one system default per zone. The `(zone, user_id)` unique
    // index can't guarantee this because system defaults have `user_id = null`
    // and Postgres treats NULLs as distinct, so it would allow duplicates. This
    // partial unique index also serves the system-default lookup by zone.
    {
      on: ["zone"],
      unique: true,
      where: "is_system_default = true",
    },
  ])
