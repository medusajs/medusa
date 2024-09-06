import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { useRemoteQueryStep } from "../../common"
import { deleteUsersWorkflow } from "./delete-users"

export type RemoveUserAccountWorkflowInput = {
  userId: string
}
export const removeUserAccountWorkflowId = "remove-user-account"
/**
 * This workflow deletes a user and remove the association in the auth identity.
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

    const authIdentity = transform({ authIdentities }, ({ authIdentities }) => {
      const authIdentity = authIdentities[0]

      if (!authIdentity) {
        throw new Error("Auth identity not found")
      }

      return authIdentity
    })

    setAuthAppMetadataStep({
      authIdentityId: authIdentity.id,
      actorType: "user",
      value: null,
    })

    return new WorkflowResponse(input.userId)
  }
)
