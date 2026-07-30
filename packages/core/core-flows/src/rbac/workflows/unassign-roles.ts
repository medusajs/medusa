import { RbacScope } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
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
  granting_actor_id?: string
  granting_actor?: string
  /**
   * Optional scope constraint filter: when provided, only assignments stored
   * with this exact scope are removed.
   */
  scope?: RbacScope
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
        scopeRef: input.scope,
      }
    })

    when(
      { normalizedInput },
      ({ normalizedInput }) => !!normalizedInput.grantingActorId
    ).then(() => {
      validateActorRolePermissionsStep({
        actor_id: normalizedInput.grantingActorId!,
        actor: normalizedInput.grantingActor,
        role_ids: normalizedInput.roleIds,
        scope: input.scope,
      })
    })

    const deleteInput = transform(
      { normalizedInput },
      ({ normalizedInput }) => {
        return {
          selector: {
            reference: normalizedInput.reference,
            reference_id: normalizedInput.referenceIds,
            role_id: normalizedInput.roleIds,
            scope: normalizedInput.scopeRef?.type,
            scope_id: normalizedInput.scopeRef?.id,
          },
        }
      }
    )

    deleteRoleAssignmentsStep(deleteInput)

    return new WorkflowResponse(void 0)
  }
)
