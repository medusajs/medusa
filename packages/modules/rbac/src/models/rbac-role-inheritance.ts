import { model } from "@medusajs/framework/utils"
import RbacRole from "./rbac-role"

const RbacRoleInheritance = model
  .define("rbac_role_inheritance", {
    id: model.id({ prefix: "rlin" }).primaryKey(),
    role: model.belongsTo(() => RbacRole, { mappedBy: "inherited_roles" }),
    inherited_role: model.belongsTo(() => RbacRole, {
      mappedBy: "inheritedBy",
    }),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["role_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["inherited_role_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["role_id", "inherited_role_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default RbacRoleInheritance
