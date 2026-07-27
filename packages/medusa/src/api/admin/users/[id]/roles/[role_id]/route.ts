import { getRequestScopes } from "@medusajs/framework"
import { unassignRolesWorkflow } from "@medusajs/core-flows"
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

  await unassignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      scope: await getRequestScopes(req),
      reference: "user",
      reference_id: userId,
      role_id: roleId,
    },
  })

  res.status(200).json({
    id: roleId,
    object: "user_role",
    deleted: true,
  })
}
