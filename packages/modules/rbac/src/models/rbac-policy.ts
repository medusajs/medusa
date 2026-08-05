import { model } from "@medusajs/framework/utils"
import RbacRolePolicy from "./rbac-role-policy"

const RbacPolicy = model
  .define("rbac_policy", {
    id: model.id({ prefix: "rpol" }).primaryKey(),
    key: model.text().searchable(),
    resource: model.text().searchable(),
    operation: model.text().searchable(),
    name: model.text().searchable().nullable(),
    description: model.text().nullable(),
    // Set by the startup sync for policies declared through `definePolicies`.
    // Only these are reconciled against the code registry; policies created
    // through the Admin API stay false and are never archived automatically.
    is_registered: model.boolean().default(false),
    metadata: model.json().nullable(),
    role_policies: model.hasMany(() => RbacRolePolicy, {
      mappedBy: "policy",
    }),
  })
  .cascades({
    // Keep the grant table in sync with the policy it points at. Without this
    // an archived policy leaves active `rbac_role_policy` rows behind, which
    // read as granted permissions that never resolve.
    delete: ["role_policies"],
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
