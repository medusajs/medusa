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
import { useQueryGraphStep } from "../../common"

/**
 * @ignore
 * @featureFlag rbac
 */
export type UnassignRole = {
  role_id: string
  reference: string
  reference_id: string
  /**
   * Optional scope constraint filter: when provided, only the assignment stored
   * with this exact scope is removed; omitted removes the matching assignments
   * regardless of the scope they are stored with.
   */
  scope?: RbacScope
}

export type UnassignRolesWorkflowInput = {
  /**
   * The role assignments to remove.
   */
  assignments: UnassignRole[]
  granting_actor_id?: string
  granting_actor?: string
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const unassignRolesWorkflowId = "unassign-roles"

/**
 * This workflow removes roles from reference entities (e.g. users, invites, or
 * custom entities). Each input assignment deletes the matching
 * `rbac_role_assignment` rows, so a single run can remove different roles from
 * different references, each optionally constrained to its own scope.
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

    when(
      { normalizedInput },
      ({ normalizedInput }) => normalizedInput.assignments.length > 0
    ).then(() => {
      const { data: roleAssignmentsToDelete } = useQueryGraphStep({
        entity: "rbac_role_assignment",
        fields: ["id"],
        filters: transform({ normalizedInput }, ({ normalizedInput }) => ({
          $or: normalizedInput.assignments.map((assignment) => ({
            role_id: assignment.role_id,
            reference: assignment.reference,
            reference_id: assignment.reference_id,
            ...(assignment.scope
              ? { scope: assignment.scope.type, scope_id: assignment.scope.id }
              : {}),
          })),
        })),
      }).config({ name: "query-role-assignments-to-delete" })

      deleteRoleAssignmentsStep(
        transform(
          { roleAssignmentsToDelete },
          ({ roleAssignmentsToDelete }) => ({
            id: roleAssignmentsToDelete.map((assignment) => assignment.id),
          })
        )
      )
    })

    return new WorkflowResponse(void 0)
  }
)
