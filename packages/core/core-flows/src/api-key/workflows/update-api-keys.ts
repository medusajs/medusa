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

/**
 * The data to update API keys.
 */
export type UpdateApiKeysWorkflowInput = {
  /**
   * The filters to select the API keys to update.
   */
  selector: FilterableApiKeyProps
  /**
   * The data to update the API keys.
   */
  update: UpdateApiKeyDTO
}

/**
 * The updated API keys.
 */
export type UpdateApiKeysWorkflowOutput = ApiKeyDTO[]

export const updateApiKeysWorkflowId = "update-api-keys"
/**
 * This workflow updates one or more secret or publishable API keys. It's used by the
 * [Update API Key Admin API Route](https://docs.medusajs.com/api/admin/api-keys/update-an-api-key).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * update API keys within your custom flows.
 * 
 * @example
 * const { result } = await updateApiKeysWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "apk_123"
 *     },
 *     update: {
 *       title: "Storefront"
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Update secret or publishable API keys.
 */
export const updateApiKeysWorkflow = createWorkflow(
  updateApiKeysWorkflowId,
  (
    input: WorkflowData<UpdateApiKeysWorkflowInput>
  ): WorkflowResponse<UpdateApiKeysWorkflowOutput> => {
    return new WorkflowResponse(updateApiKeysStep(input))
  }
)
