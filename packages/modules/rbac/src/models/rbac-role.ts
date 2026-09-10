import { model } from "@medusajs/framework/utils"
import RbacRoleAssignment from "./rbac-role-assignment"
import RbacRoleParent from "./rbac-role-parent"
import RbacRolePolicy from "./rbac-role-policy"

const RbacRole = model
  .define("rbac_role", {
    id: model.id({ prefix: "role" }).primaryKey(),
    name: model.text().searchable(),
    description: model.text().nullable(),
    metadata: model.json().nullable(),
    policies: model.hasMany(() => RbacRolePolicy, {
      mappedBy: "role",
    }),
    parents: model.hasMany(() => RbacRoleParent, {
      mappedBy: "role",
    }),
    children: model.hasMany(() => RbacRoleParent, {
      mappedBy: "parent",
    }),
    assignments: model.hasMany(() => RbacRoleAssignment, {
      mappedBy: "role",
    }),
  })
  .cascades({
    delete: ["policies", "parents", "children", "assignments"],
  })
  .indexes([
    {
      on: ["name"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default RbacRole
