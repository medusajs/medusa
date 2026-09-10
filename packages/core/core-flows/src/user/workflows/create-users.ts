import type { UserDTO, UserWorkflow } from "@medusajs/framework/types"
import { UserWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import { createRoleAssignmentsStep } from "../../rbac/steps/create-role-assignments"
import { validateRolesExistStep } from "../../rbac/steps/validate-roles-exist"
import { buildRoleAssignments } from "../../rbac/utils/build-role-assignments"
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
 * scope.
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

    const createdUsers = createUsersStep(input.users)

    const userRoleAssignments = transform(
      { input, createdUsers },
      ({ input, createdUsers }) => {
        return input.users.flatMap((user, index) =>
          buildRoleAssignments(user.roles, "user", createdUsers[index].id)
        )
      }
    )

    createRoleAssignmentsStep(userRoleAssignments)

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
