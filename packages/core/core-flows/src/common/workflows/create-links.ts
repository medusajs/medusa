import type { LinkDefinition } from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { createRemoteLinkStep } from "../steps/create-remote-links"

export const createLinksWorkflowId = "create-link"
/**
 * This workflow creates one or more links between records.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create links within your custom flows.
 *
 * Learn more about links in [this documentation](https://docs.medusajs.com/learn/fundamentals/module-links/link).
 *
 * @example
 * const { result } = await createLinksWorkflow(container)
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
 *     }
 *   ]
 * })
 *
 * @summary
 *
 * Create links between two records of linked data models.
 */
export const createLinksWorkflow = createWorkflow(
  createLinksWorkflowId,
  (input: WorkflowData<LinkDefinition[]>) => {
    return new WorkflowResponse(createRemoteLinkStep(input))
  }
)
