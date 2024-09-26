import { ApiKeyDTO, CreateApiKeyDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createApiKeysStep } from "../steps"

export type CreateApiKeysWorkflowInput = { api_keys: CreateApiKeyDTO[] }

export const createApiKeysWorkflowId = "create-api-keys"
/**
 * This workflow creates one or more API keys.
 */
export const createApiKeysWorkflow = createWorkflow(
  createApiKeysWorkflowId,
  (
    input: WorkflowData<CreateApiKeysWorkflowInput>
  ): WorkflowResponse<ApiKeyDTO[]> => {
    return new WorkflowResponse(createApiKeysStep(input))
  }
)
