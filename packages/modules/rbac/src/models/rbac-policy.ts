import { model } from "@medusajs/framework/utils"

const RbacPolicy = model
  .define("rbac_policy", {
    id: model.id({ prefix: "rpol" }).primaryKey(),
    key: model.text().searchable(),
    resource: model.text().searchable(),
    operation: model.text().searchable(),
    name: model.text().searchable().nullable(),
    description: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["key"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      on: ["resource"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["operation"],
      where: "deleted_at IS NULL",
    },
  ])

export default RbacPolicy
