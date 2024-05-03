import { ApiKeyDTO, CreateApiKeyDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createApiKeysStep } from "../steps"

type WorkflowInput = { api_keys: CreateApiKeyDTO[] }

export const createApiKeysWorkflowId = "create-api-keys"
export const createApiKeysWorkflow = createWorkflow(
  createApiKeysWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<ApiKeyDTO[]> => {
    return createApiKeysStep(input)
  }
)
