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

/**
 * The data to revoke API keys.
 */
export type RevokeApiKeysWorkflowInput = {
  /**
   * The filters to select the API keys to revoke.
   */
  selector: FilterableApiKeyProps
  /**
   * The data to revoke the API keys.
   */
  revoke: RevokeApiKeyDTO
}

/**
 * The revoked API keys.
 */
export type RevokeApiKeysWorkflowOutput = ApiKeyDTO[]

export const revokeApiKeysWorkflowId = "revoke-api-keys"
/**
 * This workflow revokes one or more API keys. If the API key is a secret, 
 * it can't be used for authentication anymore. If it's publishable, it can't be used by client applications.
 * 
 * This workflow is used by the [Revoke API Key API Route](https://docs.medusajs.com/api/admin/api-keys/revoke-api-key).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * revoke API keys within your custom flows.
 * 
 * @example
 * const { result } = await revokeApiKeysWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "apk_123"
 *     },
 *     revoke: {
 *       revoked_by: "user_123"
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Revoke secret or publishable API keys.
 */
export const revokeApiKeysWorkflow = createWorkflow(
  revokeApiKeysWorkflowId,
  (
    input: WorkflowData<RevokeApiKeysWorkflowInput>
  ): WorkflowResponse<RevokeApiKeysWorkflowOutput> => {
    return new WorkflowResponse(revokeApiKeysStep(input))
  }
)
