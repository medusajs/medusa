import { LinkDefinition, RemoteLink } from "@medusajs/modules-sdk"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

export type DismissRemoteLinksStepInput = LinkDefinition | LinkDefinition[]

// TODO: add ability for this step to restore links from only foreign keys
export const dismissRemoteLinkStepId = "dismiss-remote-links"
/**
 * This step removes remote links between two records of linked data models.
 * 
 * Learn more in the [Remote Link documentation.](https://docs.medusajs.com/v2/advanced-development/modules/remote-link#dismiss-link).
 * 
 * @example
 * import { 
 *   createWorkflow
 * } from "@medusajs/workflows-sdk"
 * import {
 *   dismissRemoteLinkStep
 * } from "@medusajs/core-flows"
 * import {
 *   Modules
 * } from "@medusajs/utils"
 * 
 * const helloWorldWorkflow = createWorkflow(
 *   "hello-world",
 *   () => {
 *     dismissRemoteLinkStep([{
 *       [Modules.PRODUCT]: {
 *         product_id: "prod_123",
 *       },
 *       "helloModuleService": {
 *         my_custom_id: "mc_123",
 *       },
 *     }])
 *   }
 * )
 */
export const dismissRemoteLinkStep = createStep(
  dismissRemoteLinkStepId,
  async (data: DismissRemoteLinksStepInput, { container }) => {
    const entries = Array.isArray(data) ? data : [data]

    if (!entries.length) {
      return new StepResponse([], [])
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    // Our current revert strategy for dismissed links are to recreate it again.
    // This works when its just the primary keys, but when you have additional data
    // in the links, we need to preserve them in order to recreate the links accurately.
    const dataBeforeDismiss = (await link.list(data, {
      asLinkDefinition: true,
    })) as LinkDefinition[]

    await link.dismiss(entries)

    return new StepResponse(entries, dataBeforeDismiss)
  },
  async (dataBeforeDismiss, { container }) => {
    if (!dataBeforeDismiss?.length) {
      return
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    await link.create(dataBeforeDismiss)
  }
)
