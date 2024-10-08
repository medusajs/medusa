import {
  ApiKeyDTO,
  FilterableApiKeyProps,
  RevokeApiKeyDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { revokeApiKeysStep } from "../steps"

export type RevokeApiKeysWorkflowInput = {
  selector: FilterableApiKeyProps
  revoke: RevokeApiKeyDTO
}

export const revokeApiKeysWorkflowId = "revoke-api-keys"
/**
 * This workflow revokes one or more API keys.
 */
export const revokeApiKeysWorkflow = createWorkflow(
  revokeApiKeysWorkflowId,
  (
    input: WorkflowData<RevokeApiKeysWorkflowInput>
  ): WorkflowResponse<ApiKeyDTO[]> => {
    return new WorkflowResponse(revokeApiKeysStep(input))
  }
)
