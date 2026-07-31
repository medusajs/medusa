import { RbacScope } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { createRoleAssignmentsStep } from "../steps/create-role-assignments"
import { validateActorRolePermissionsStep } from "../steps/validate-actor-role-permissions"
import { validateRolesExistStep } from "../steps/validate-roles-exist"
import { CreateRbacRoleAssignmentDTO } from "@medusajs/framework/types"

/**
 * @ignore
 * @featureFlag rbac
 */
export type AssignRole = {
  role_id: string
  reference: string
  reference_id: string
  /**
   * Optional scope constraint stored on the assignment: the role only applies
   * when acting within the given scope entity.
   */
  scope?: RbacScope
}

export type AssignRolesWorkflowInput = {
  /**
   * The role assignments to create.
   */
  assignments: AssignRole[]
  granting_actor_id?: string
  granting_actor?: string
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const assignRolesWorkflowId = "assign-roles"

/**
 * This workflow assigns roles to reference entities (e.g. users, invites, or
 * custom entities). Each input assignment becomes one `rbac_role_assignment`
 * row, so a single run can assign different roles to different references,
 * each optionally constrained to its own scope.
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
      const assignments = input.assignments ?? []

      return {
        grantingActorId: input.granting_actor_id,
        grantingActor: input.granting_actor,
        assignments,
        roleIds: Array.from(
          new Set(assignments.map((assignment) => assignment.role_id))
        ),
      }
    })

    validateRolesExistStep(normalizedInput.roleIds)

    when(
      { normalizedInput },
      ({ normalizedInput }) => !!normalizedInput.grantingActorId
    ).then(() => {
      validateActorRolePermissionsStep({
        actor_id: normalizedInput.grantingActorId!,
        actor: normalizedInput.grantingActor,
        role_ids: normalizedInput.roleIds,
      })
    })

    const assignments = transform(
      { normalizedInput },
      ({ normalizedInput }) => {
        return normalizedInput.assignments.map(
          (assignment): CreateRbacRoleAssignmentDTO => ({
            role_id: assignment.role_id,
            reference: assignment.reference,
            reference_id: assignment.reference_id,
            scope: assignment.scope?.type,
            scope_id: assignment.scope?.id,
          })
        )
      }
    )

    createRoleAssignmentsStep(assignments)

    return new WorkflowResponse(void 0)
  }
)
