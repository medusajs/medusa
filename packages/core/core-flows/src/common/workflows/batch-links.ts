import type {
  BatchWorkflowInput,
  LinkDefinition,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep } from "../steps/create-remote-links"
import { dismissRemoteLinkStep } from "../steps/dismiss-remote-links"
import { updateRemoteLinksStep } from "../steps/update-remote-links"

export const batchLinksWorkflowId = "batch-links"
/**
 * This workflow manages one or more links to create, update, or dismiss them.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * manage links within your custom flows.
 *
 * Learn more about links in [this documentation](https://docs.medusajs.com/learn/fundamentals/module-links/link).
 *
 * @example
 * const { result } = await batchLinksWorkflow(container)
 * .run({
 *   input: {
 *     create: [
 *       {
 *         // import { Modules } from "@medusajs/framework/utils"
 *         [Modules.PRODUCT]: {
 *           product_id: "prod_123",
 *         },
 *         "helloModuleService": {
 *           my_custom_id: "mc_123",
 *         },
 *       }
 *     ],
 *     update: [
 *       {
 *         // import { Modules } from "@medusajs/framework/utils"
 *         [Modules.PRODUCT]: {
 *           product_id: "prod_321",
 *         },
 *         "helloModuleService": {
 *           my_custom_id: "mc_321",
 *         },
 *         data: {
 *           metadata: {
 *             test: false
 *           }
 *         }
 *       }
 *     ],
 *     delete: [
 *       {
 *         // import { Modules } from "@medusajs/framework/utils"
 *         [Modules.PRODUCT]: {
 *           product_id: "prod_321",
 *         },
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Manage links between two records of linked data models.
 */
export const batchLinksWorkflow = createWorkflow(
  batchLinksWorkflowId,
  (
    input: WorkflowData<
      BatchWorkflowInput<LinkDefinition, LinkDefinition, LinkDefinition>
    >
  ) => {
    const { create, update, delete: deleteLinks } = transform(
      { input },
      (data) => {
        return {
          create: data.input.create || [],
          update: data.input.update || [],
          delete: data.input.delete || [],
        }
      }
    )
    const [created, updated, deleted] = parallelize(
      createRemoteLinkStep(create),
      updateRemoteLinksStep(update),
      dismissRemoteLinkStep(deleteLinks)
    )

    return new WorkflowResponse({
      created,
      updated,
      deleted,
    })
  }
)
