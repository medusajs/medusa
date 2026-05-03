import { AuthTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createAuthIdentitiesStep } from "../steps"

export const createAuthIdentitiesWorkflowId = "create-auth-identities"
/**
 * This workflow creates one or more auth identities.
 */
export const createAuthIdentitiesWorkflow = createWorkflow(
  createAuthIdentitiesWorkflowId,
  (
    input: WorkflowData<AuthTypes.CreateAuthIdentityDTO[]>
  ): WorkflowResponse<AuthTypes.AuthIdentityDTO[]> => {
    return new WorkflowResponse(createAuthIdentitiesStep(input))
  }
)
