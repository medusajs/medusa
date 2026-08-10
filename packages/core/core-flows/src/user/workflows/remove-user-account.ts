import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { deleteAuthIdentityStep, setAuthAppMetadataStep } from "../../auth"
import { useQueryGraphStep } from "../../common"
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

    const { data: authIdentities } = useQueryGraphStep({
      entity: "auth_identity",
      fields: ["id", "app_metadata", "provider_identities.entity_id"],
      filters: {
        app_metadata: {
          user_id: input.userId,
        },
      },
    }).config({ name: "query-auth-identity" })

    const authIdentity = transform(
      { authIdentities, input },
      ({ authIdentities }) => {
        return authIdentities[0]
      }
    )

    const shouldKeepAuthIdentity = transform(
      { authIdentity },
      ({ authIdentity }) => {
        if (!authIdentity) {
          return undefined
        }

        // Only keep the auth identity if it has other actor types associated with it
        return Object.entries(authIdentity.app_metadata)
          .filter(([key, _]) => key !== "user_id")
          .some(([_, value]) => value !== null)
      }
    )

    when({ shouldKeepAuthIdentity }, ({ shouldKeepAuthIdentity }) => {
      return shouldKeepAuthIdentity === true
    }).then(() => {
      // we don't remove a matching entity_id provider_entity, since it could be used by the remaining
      // actor types.
      setAuthAppMetadataStep({
        authIdentityId: authIdentity.id,
        actorType: "user",
        value: null,
      })
    })

    when({ shouldKeepAuthIdentity }, ({ shouldKeepAuthIdentity }) => {
      return shouldKeepAuthIdentity === false
    }).then(() => {
      deleteAuthIdentityStep({
        id: authIdentity.id,
      })
    })

    return new WorkflowResponse(input.userId)
  }
)
