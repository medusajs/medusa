import { removeUserRolesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

/**
 * @ignore
 * @featureFlag rbac
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id: userId, role_id: roleId } = req.params

  await removeUserRolesWorkflow(req.scope).run({
    input: {
      actor_id: req.auth_context.actor_id,
      actor: req.auth_context.actor_type,
      user_id: userId,
      role_ids: [roleId],
    },
  })

  res.status(200).json({
    id: roleId,
    object: "user_role",
    deleted: true,
  })
}
