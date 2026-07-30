import { unassignRolesWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
/**
 * @ignore
 * @featureFlag rbac
 */
export const DELETE = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUnassignUserRole>,
  res: MedusaResponse
) => {
  const { id: userId, role_id: roleId } = req.params
  const { scope, scope_id } = req.validatedBody

  await unassignRolesWorkflow(req.scope).run({
    input: {
      granting_actor_id: req.auth_context.actor_id,
      granting_actor: req.auth_context.actor_type,
      assignments: [
        {
          role_id: roleId,
          reference: "user",
          reference_id: userId,
          scope: scope && scope_id ? { type: scope, id: scope_id } : undefined,
        },
      ],
    },
  })

  res.status(200).json({
    id: roleId,
    object: "user_role",
    deleted: true,
  })
}
