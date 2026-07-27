import { RbacScopeRef } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { deleteRoleAssignmentsStep } from "../steps/delete-role-assignments"
import { validateActorRolePermissionsStep } from "../steps/validate-actor-role-permissions"

/**
 * @ignore
 * @featureFlag rbac
 */
export type UnassignRolesWorkflowInput = {
  reference: string
  reference_id: string | string[]
  role_id: string | string[]
  granting_actor_id: string
  granting_actor: string
  /**
   * Server-derived scope context the grant happens within. When provided, the
   * granting actor's privileges are evaluated strictly within it; omitted =
   * the actor's full scope-union.
   */
  scope?: RbacScopeRef | RbacScopeRef[]
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const unassignRolesWorkflowId = "unassign-roles"

/**
 * This workflow removes one or more roles from one or more reference entities
 * (e.g. users, invites, or custom entities). It deletes the matching
 * `rbac_role_assignment` rows.
 *
 * It validates that the granting actor holds all the policies of the roles
 * being removed.
 * @ignore
 * @featureFlag rbac
 */
export const unassignRolesWorkflow = createWorkflow(
  unassignRolesWorkflowId,
  (input: WorkflowData<UnassignRolesWorkflowInput>) => {
    const normalizedInput = transform({ input }, ({ input }) => {
      return {
        grantingActorId: input.granting_actor_id,
        grantingActor: input.granting_actor,
        reference: input.reference,
        referenceIds: Array.isArray(input.reference_id)
          ? input.reference_id
          : [input.reference_id],
        roleIds: Array.isArray(input.role_id) ? input.role_id : [input.role_id],
      }
    })

    validateActorRolePermissionsStep({
      actor_id: normalizedInput.grantingActorId,
      actor: normalizedInput.grantingActor,
      role_ids: normalizedInput.roleIds,
      scope: input.scope,
    })

    const deleteInput = transform(
      { normalizedInput },
      ({ normalizedInput }) => {
        return {
          reference: normalizedInput.reference,
          reference_id: normalizedInput.referenceIds,
          role_id: normalizedInput.roleIds,
        }
      }
    )

    deleteRoleAssignmentsStep(deleteInput)

    return new WorkflowResponse(void 0)
  }
)
