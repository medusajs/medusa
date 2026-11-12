import { MedusaModule } from "@medusajs/framework/modules-sdk"
import type { UserDTO, UserWorkflow } from "@medusajs/framework/types"
import {
  Modules,
  RBAC_SUPER_ADMIN_ROLE_ID,
  UserWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { useQueryGraphStep } from "../../common/steps/use-query-graph"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { createRoleAssignmentsStep } from "../../rbac/steps/create-role-assignments"
import { SUPER_ADMIN_GUARD_LOCK_KEY } from "../../rbac/steps/ensure-super-admin-remains"
import { validateActorRolePermissionsStep } from "../../rbac/steps/validate-actor-role-permissions"
import { validateRolesExistStep } from "../../rbac/steps/validate-roles-exist"
import {
  buildRoleAssignments,
  buildRoleScopePairs,
} from "../../rbac/utils/build-role-assignments"
import { createUsersStep } from "../steps"

export const createUsersWorkflowId = "create-users-workflow"
/**
 * This workflow creates one or more users. It's used by other workflows, such
 * as {@link acceptInviteWorkflow} to create a user for an invite.
 *
 * You can attach an auth identity to each user to allow the user to log in using the
 * {@link setAuthAppMetadataStep}. Learn more about auth identities in
 * [this documentation](https://docs.medusajs.com/resources/commerce-modules/auth/auth-identity-and-actor-types).
 *
 * You can provide roles to be assigned to each user during creation. Each role
 * can be constrained to one or more scopes, creating one role assignment per
 * scope. When an `rbac_context` is provided, its actor can only assign roles
 * whose policies it holds itself.
 *
 * When RBAC is installed and no user holds the super admin role yet, the
 * created users are also assigned the super admin role, so that the first
 * users of a new deployment aren't locked out. Once a super admin exists,
 * users only get the roles they're created with.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create users within your custom flows.
 *
 * @example
 * const { result } = await createUsersWorkflow(container)
 * .run({
 *   input: {
 *     users: [{
 *       email: "example@gmail.com",
 *       first_name: "John",
 *       last_name: "Doe",
 *       roles: [
 *         { role_id: "role_super_admin" },
 *         {
 *           role_id: "role_editor",
 *           scopes: [{ type: "organization", id: "org_123" }]
 *         }
 *       ]
 *     }]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more users with optional role assignment.
 */
export const createUsersWorkflow = createWorkflow(
  createUsersWorkflowId,
  (
    input: WorkflowData<UserWorkflow.CreateUsersWorkflowInputDTO>
  ): WorkflowResponse<UserDTO[]> => {
    const allRoleIds = transform({ input }, ({ input }) => {
      const roleIds = new Set<string>()
      input.users.forEach((user) => {
        for (const role of user.roles || []) {
          roleIds.add(role.role_id)
        }
      })
      return Array.from(roleIds)
    })

    validateRolesExistStep(allRoleIds)

    const roleAssignments = transform({ input }, ({ input }) => {
      return input.users.flatMap((user) => buildRoleScopePairs(user.roles))
    })

    when(
      { roleAssignments, input },
      ({ roleAssignments, input }) =>
        !!input.rbac_context?.actor_id && !!roleAssignments.length
    ).then(() => {
      validateActorRolePermissionsStep({
        actor_id: input.rbac_context!.actor_id,
        actor: input.rbac_context!.actor,
        granting_scope: input.rbac_context!.scope,
        assignments: roleAssignments,
      })
    })

    const shouldCheckSuperAdmin = transform(
      { roleAssignments },
      ({ roleAssignments }) =>
        MedusaModule.isInstalled(Modules.RBAC) &&
        !roleAssignments.some(
          (assignment) =>
            assignment.role_id === RBAC_SUPER_ADMIN_ROLE_ID && !assignment.scope
        )
    )

    // Serializes the super admin check with the assignment it may lead to, so
    // that concurrent first users can't all become super admins.
    const shouldBootstrapSuperAdmin = when(
      "should-bootstrap-super-admin",
      { shouldCheckSuperAdmin },
      ({ shouldCheckSuperAdmin }) => shouldCheckSuperAdmin
    ).then(() => {
      acquireLockStep({
        key: SUPER_ADMIN_GUARD_LOCK_KEY,
        timeout: 2,
        ttl: 10,
        executeOnSubWorkflow: true,
      })

      const { data } = useQueryGraphStep({
        entity: "rbac_role_assignment",
        fields: ["id"],
        filters: {
          role_id: RBAC_SUPER_ADMIN_ROLE_ID,
          reference: "user",
          scope: null,
          scope_id: null,
        },
        pagination: { take: 1 },
      }).config({ name: "query-super-admin-assignments" })

      return transform({ data }, ({ data }) => !data.length)
    })

    const createdUsers = createUsersStep(input.users)

    const userRoleAssignments = transform(
      { input, createdUsers, shouldBootstrapSuperAdmin },
      ({ input, createdUsers, shouldBootstrapSuperAdmin }) => {
        return input.users.flatMap((user, index) =>
          buildRoleAssignments(
            shouldBootstrapSuperAdmin
              ? [...(user.roles ?? []), { role_id: RBAC_SUPER_ADMIN_ROLE_ID }]
              : user.roles,
            "user",
            createdUsers[index].id
          )
        )
      }
    )

    createRoleAssignmentsStep(userRoleAssignments)

    when(
      "release-super-admin-bootstrap-lock",
      { shouldCheckSuperAdmin },
      ({ shouldCheckSuperAdmin }) => shouldCheckSuperAdmin
    ).then(() => {
      releaseLockStep({
        key: SUPER_ADMIN_GUARD_LOCK_KEY,
        executeOnSubWorkflow: true,
      })
    })

    const userIdEvents = transform({ createdUsers }, ({ createdUsers }) => {
      return createdUsers.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: UserWorkflowEvents.CREATED,
      data: userIdEvents,
    })

    return new WorkflowResponse(createdUsers)
  }
)
