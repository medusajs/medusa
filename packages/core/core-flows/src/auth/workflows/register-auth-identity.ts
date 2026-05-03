import { AuthTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { registerAuthIdentityStep } from "../steps"

export const registerAuthIdentityWorkflowId = "register-auth-identity"
/**
 * This workflow registers a new auth identity using a specified provider.
 * It ensures that provider-specific logic (e.g. password hashing for emailpass) is executed.
 */
export const registerAuthIdentityWorkflow = createWorkflow(
  registerAuthIdentityWorkflowId,
  (
    input: WorkflowData<{ provider: string; providerData: AuthTypes.AuthenticationInput }>
  ): WorkflowResponse<AuthTypes.AuthIdentityDTO> => {
    return new WorkflowResponse(registerAuthIdentityStep(input))
  }
)
