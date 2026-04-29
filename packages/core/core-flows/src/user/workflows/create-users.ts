import type { UserDTO, UserWorkflow } from "@medusajs/framework/types"
import { UserWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../../common/steps/create-remote-links"
import { emitEventStep } from "../../common/steps/emit-event"
import { validateRolesExistStep } from "../../invite/steps/validate-roles-exist"
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
 * You can provide roles to be assigned to each user during creation.
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
 *       roles: ["role_super_admin"]
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
        for (const roleId of user.roles || []) {
          roleIds.add(roleId)
        }
      })
      return Array.from(roleIds)
    })

    validateRolesExistStep(allRoleIds)

    const createdUsers = createUsersStep(input.users)

    const userRoleLinks = transform(
      { input, createdUsers },
      ({ input, createdUsers }) => {
        const links: {
          [key: string]: { user_id?: string; rbac_role_id?: string }
        }[] = []
        input.users.forEach((user, index) => {
          const userId = createdUsers[index].id
          for (const roleId of user.roles || []) {
            links.push({
              user: { user_id: userId },
              rbac: { rbac_role_id: roleId },
            })
          }
        })
        return links
      }
    )

    createRemoteLinkStep(userRoleLinks)

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
