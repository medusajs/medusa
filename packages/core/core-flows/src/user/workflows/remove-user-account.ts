import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { useRemoteQueryStep } from "../../common"
import { deleteUsersWorkflow } from "./delete-users"

/**
 * The data to remove a user account.
 */
export type RemoveUserAccountWorkflowInput = {
  /**
   * The ID of the user to remove.
   */
  userId: string
}
export const removeUserAccountWorkflowId = "remove-user-account"
/**
 * This workflow deletes a user and remove the association to its auth identity. It's used
 * by the [Delete User Admin API Route](https://docs.medusajs.com/api/admin/users/delete-a-user).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete users within your custom flows.
 * 
 * @example
 * const { result } = await removeUserAccountWorkflow(container)
 * .run({
 *   input: {
 *     userId: "user_123"
 *   }
 * })
 * 
 * @summary
 * 
 * Delete a user and remove the association to its auth identity.
 */
export const removeUserAccountWorkflow = createWorkflow(
  removeUserAccountWorkflowId,
  (
    input: WorkflowData<RemoveUserAccountWorkflowInput>
  ): WorkflowResponse<string> => {
    deleteUsersWorkflow.runAsStep({
      input: {
        ids: [input.userId],
      },
    })

    const authIdentities = useRemoteQueryStep({
      entry_point: "auth_identity",
      fields: ["id"],
      variables: {
        filters: {
          app_metadata: {
            user_id: input.userId,
          },
        },
      },
    })

    const authIdentity = transform(
      { authIdentities, input },
      ({ authIdentities }) => {
        return authIdentities[0]
      }
    )

    when({ authIdentity }, ({ authIdentity }) => {
      return !!authIdentity
    }).then(() => {
      setAuthAppMetadataStep({
        authIdentityId: authIdentity.id,
        actorType: "user",
        value: null,
      })
    })

    return new WorkflowResponse(input.userId)
  }
)
