import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createRoleAssignmentsStep } from "../steps/create-role-assignments"
import { validateActorRolePermissionsStep } from "../steps/validate-actor-role-permissions"
import { validateRolesExistStep } from "../steps/validate-roles-exist"

/**
 * @ignore
 * @featureFlag rbac
 */
export type AssignRolesWorkflowInput = {
  reference: string
  reference_id: string | string[]
  role_id: string | string[]
  granting_actor_id: string
  granting_actor: string
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const assignRolesWorkflowId = "assign-roles"

/**
 * This workflow assigns one or more roles to one or more reference entities
 * (e.g. users, invites, or custom entities). It creates the cross-product of
 * the provided reference ids and role ids as `rbac_role_assignment` rows.
 *
 * It validates that the roles exist and that the granting actor holds all the
 * policies of the roles being assigned.
 * @ignore
 * @featureFlag rbac
 */
export const assignRolesWorkflow = createWorkflow(
  assignRolesWorkflowId,
  (input: WorkflowData<AssignRolesWorkflowInput>) => {
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

    validateRolesExistStep(normalizedInput.roleIds)

    validateActorRolePermissionsStep({
      actor_id: normalizedInput.grantingActorId,
      actor: normalizedInput.grantingActor,
      role_ids: normalizedInput.roleIds,
    })

    const assignments = transform(
      { normalizedInput },
      ({ normalizedInput }) => {
        const rows: {
          role_id: string
          reference: string
          reference_id: string
        }[] = []

        for (const referenceId of normalizedInput.referenceIds) {
          for (const roleId of normalizedInput.roleIds) {
            rows.push({
              role_id: roleId,
              reference: normalizedInput.reference,
              reference_id: referenceId,
            })
          }
        }

        return rows
      }
    )

    createRoleAssignmentsStep(assignments)

    return new WorkflowResponse(void 0)
  }
)
