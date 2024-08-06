import { ApiKeyDTO, CreateApiKeyDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createApiKeysStep } from "../steps"

type WorkflowInput = { api_keys: CreateApiKeyDTO[] }

export const createApiKeysWorkflowId = "create-api-keys"
export const createApiKeysWorkflow = createWorkflow(
  createApiKeysWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<ApiKeyDTO[]> => {
    return new WorkflowResponse(createApiKeysStep(input))
  }
)
