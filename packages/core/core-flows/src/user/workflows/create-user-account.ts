import type { CreateUserDTO, UserDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { createUsersWorkflow } from "./create-users"

/**
 * The details of the user account to create.
 */
export type CreateUserAccountWorkflowInput = {
  /**
   * The ID of the auth identity to attach the user to.
   */
  authIdentityId: string
  /**
   * The details of the user to create.
   */
  userData: CreateUserDTO
}

export const createUserAccountWorkflowId = "create-user-account"
/**
 * This workflow creates a user and attaches it to an auth identity.
 *
 * You can create an auth identity first using the [Retrieve Registration JWT Token API Route](https://docs.medusajs.com/api/admin/auth/retrieve-registration-jwt-token).
 * Learn more about basic authentication flows in [this documentation](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * register or create user accounts within your custom flows.
 *
 * @example
 * const { result } = await createUserAccountWorkflow(container)
 * .run({
 *   input: {
 *     authIdentityId: "au_123",
 *     userData: {
 *       email: "example@gmail.com",
 *       first_name: "John",
 *       last_name: "Doe",
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Create a user account and attach an auth identity.
 */
export const createUserAccountWorkflow = createWorkflow(
  createUserAccountWorkflowId,
  (
    input: WorkflowData<CreateUserAccountWorkflowInput>
  ): WorkflowResponse<UserDTO> => {
    const users = createUsersWorkflow.runAsStep({
      input: {
        users: [input.userData],
      },
    })

    const user = transform(users, (users: UserDTO[]) => users[0])

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "user",
      value: user.id,
    })
    return new WorkflowResponse(user)
  }
)
