import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { deleteUsersWorkflow } from "./delete-users"

export type RemoveUserAccountWorkflowInput = {
  authIdentityId: string
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

    setAuthAppMetadataStep({
      authIdentityId: input.authIdentityId,
      actorType: "user",
      value: null,
    })

    return new WorkflowResponse(input.userId)
  }
)
