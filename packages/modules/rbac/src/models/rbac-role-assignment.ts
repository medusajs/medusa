import { model } from "@medusajs/framework/utils"
import RbacRole from "./rbac-role"

const RbacRoleAssignment = model
  .define("rbac_role_assignment", {
    id: model.id({ prefix: "rasgn" }).primaryKey(),
    role: model.belongsTo(() => RbacRole, { mappedBy: "assignments" }),
    reference: model.text(),
    reference_id: model.text(),
    scope: model.text().nullable(),
    scope_id: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["role_id", "scope", "scope_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["scope", "scope_id", "reference", "reference_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["reference", "reference_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["role_id", "scope", "scope_id", "reference", "reference_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default RbacRoleAssignment
