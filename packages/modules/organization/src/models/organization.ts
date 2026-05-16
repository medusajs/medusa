import { model } from "@medusajs/framework/utils"

const Organization = model
  .define("Organization", {
    id: model.id({ prefix: "org" }).primaryKey(),
    name: model.text().searchable(),
    code: model.text().unique(),
    parent_id: model.text().nullable(),
    org_type: model.enum(["brand_bu", "operation", "department"]),
    status: model.enum(["active", "inactive"]).default("active"),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_organization_code_unique",
      on: ["code"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_organization_parent_id",
      on: ["parent_id"],
      where: "deleted_at IS NULL",
    },
  ])

export default Organization
