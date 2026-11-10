import { RbacScope } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { deleteRoleAssignmentsStep } from "../steps/delete-role-assignments"
import {
  ensureSuperAdminRemainsStep,
  SUPER_ADMIN_GUARD_LOCK_KEY,
} from "../steps/ensure-super-admin-remains"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { validateActorRolePermissionsStep } from "../steps/validate-actor-role-permissions"
import { useQueryGraphStep } from "../../common"

/**
 * @since 2.22.3
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
  /**
   * The scope the granting actor is acting within. Their role assignments
   * scoped to it only allow removing assignments scoped to that same scope;
   * removing assignments of other scopes, or regardless of scope, requires
   * their unscoped privileges.
   */
  granting_scope?: RbacScope
}

/**
 * @since 2.22.3
 */
export const unassignRolesWorkflowId = "unassign-roles"

/**
 * This workflow removes roles from reference entities (e.g. users, invites, or
 * custom entities). Each input assignment deletes the matching
 * `rbac_role_assignment` rows, so a single run can remove different roles from
 * different references, each optionally constrained to its own scope.
 *
 * It validates that the granting actor holds all the policies of the roles
 * being removed, and that at least one user keeps the super admin role. That
 * check and the removal run under a lock, so concurrent removals can't both
 * pass it.
 * @since 2.22.3
 */
export const unassignRolesWorkflow = createWorkflow(
  unassignRolesWorkflowId,
  (input: WorkflowData<UnassignRolesWorkflowInput>) => {
    const normalizedInput = transform({ input }, ({ input }) => {
      const assignments = input.assignments ?? []

      return {
        grantingActorId: input.granting_actor_id,
        grantingActor: input.granting_actor,
        grantingScope: input.granting_scope,
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
        granting_scope: normalizedInput.grantingScope,
        assignments: normalizedInput.assignments,
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

      const roleAssignmentIdsToDelete = transform(
        { roleAssignmentsToDelete },
        ({ roleAssignmentsToDelete }) =>
          roleAssignmentsToDelete.map((assignment) => assignment.id)
      )

      acquireLockStep({
        key: SUPER_ADMIN_GUARD_LOCK_KEY,
        timeout: 2,
        ttl: 10,
        // Also lock when run from another workflow.
        executeOnSubWorkflow: true,
      })

      ensureSuperAdminRemainsStep({
        excluded_assignment_ids: roleAssignmentIdsToDelete,
      })

      deleteRoleAssignmentsStep({ id: roleAssignmentIdsToDelete })

      releaseLockStep({
        key: SUPER_ADMIN_GUARD_LOCK_KEY,
        executeOnSubWorkflow: true,
      })
    })

    return new WorkflowResponse(void 0)
  }
)
