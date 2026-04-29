import { Link } from "@medusajs/framework/modules-sdk"
import type { LinkDefinition } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export type DismissRemoteLinksStepInput = LinkDefinition | LinkDefinition[]

// TODO: add ability for this step to restore links from only foreign keys
export const dismissRemoteLinkStepId = "dismiss-remote-links"
/**
 * This step removes links between two records of linked data models.
 *
 * Learn more in the [Link documentation.](https://docs.medusajs.com/learn/fundamentals/module-links/link#dismiss-link).
 *
 * @example
 * dismissRemoteLinkStep([{
 *   [Modules.PRODUCT]: {
 *     product_id: "prod_123",
 *   },
 *   blog: {
 *     post_id: "post_123",
 *   },
 * }])
 */
export const dismissRemoteLinkStep = createStep(
  dismissRemoteLinkStepId,
  async (data: DismissRemoteLinksStepInput, { container }) => {
    const entries = Array.isArray(data) ? data : [data]

    if (!entries.length) {
      return new StepResponse([], [])
    }

    const link = container.resolve<Link>(ContainerRegistrationKeys.LINK)

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

    const link = container.resolve<Link>(ContainerRegistrationKeys.LINK)

    await link.create(dataBeforeDismiss)
  }
)
