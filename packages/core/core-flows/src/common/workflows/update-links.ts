import type { LinkDefinition } from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { updateRemoteLinksStep } from "../steps/update-remote-links"

export const updateLinksWorkflowId = "update-link"
/**
 * This workflow updates one or more links between records.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * update links within your custom flows.
 *
 * Learn more about links in [this documentation](https://docs.medusajs.com/learn/fundamentals/module-links/link).
 *
 * @example
 * const { result } = await updateLinksWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       // import { Modules } from "@zjedene-medusa/framework/utils"
 *       [Modules.PRODUCT]: {
 *         product_id: "prod_123",
 *       },
 *       "helloModuleService": {
 *         my_custom_id: "mc_123",
 *       },
 *       data: {
 *         metadata: {
 *           test: false,
 *         },
 *       }
 *     }
 *   ]
 * })
 *
 * @summary
 *
 * Update links between two records of linked data models.
 */
export const updateLinksWorkflow = createWorkflow(
  updateLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return new WorkflowResponse(updateRemoteLinksStep(input))
  }
)
