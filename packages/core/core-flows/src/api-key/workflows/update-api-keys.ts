import {
  ApiKeyDTO,
  FilterableApiKeyProps,
  UpdateApiKeyDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateApiKeysStep } from "../steps"

export type UpdateApiKeysWorkflowInput = {
  selector: FilterableApiKeyProps
  update: UpdateApiKeyDTO
}

export const updateApiKeysWorkflowId = "update-api-keys"
/**
 * This workflow creates one or more API keys.
 */
export const updateApiKeysWorkflow = createWorkflow(
  updateApiKeysWorkflowId,
  (
    input: WorkflowData<UpdateApiKeysWorkflowInput>
  ): WorkflowResponse<ApiKeyDTO[]> => {
    return new WorkflowResponse(updateApiKeysStep(input))
  }
)
