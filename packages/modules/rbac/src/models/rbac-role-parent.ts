import { model } from "@medusajs/framework/utils"
import RbacRole from "./rbac-role"

const RbacRoleParent = model
  .define("rbac_role_parent", {
    id: model.id({ prefix: "rlin" }).primaryKey(),
    role: model.belongsTo(() => RbacRole, { mappedBy: "parents" }),
    parent: model.belongsTo(() => RbacRole),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      on: ["role_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["parent_id"],
      where: "deleted_at IS NULL",
    },
    {
      on: ["role_id", "parent_id"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default RbacRoleParent
