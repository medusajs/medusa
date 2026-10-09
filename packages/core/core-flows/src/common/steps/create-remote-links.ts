import { Link } from "@medusajs/framework/modules-sdk"
import type { LinkDefinition } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const createLinksStepId = "create-remote-links"
/**
 * This step creates links between two records of linked data models.
 *
 * Learn more in the [Link documentation.](https://docs.medusajs.com/learn/fundamentals/module-links/link#create-link).
 *
 * @example
 * createRemoteLinkStep([{
 *   [Modules.PRODUCT]: {
 *     product_id: "prod_123",
 *   },
 *   blog: {
 *     post_id: "post_123",
 *   },
 * }])
 */
export const createRemoteLinkStep = createStep(
  createLinksStepId,
  async (data: LinkDefinition[], { container }) => {
    const link = container.resolve<Link>(ContainerRegistrationKeys.LINK)

    if (!data.length) {
      return new StepResponse([], [])
    }

    try {
      await link.create(data)
    } catch (error) {
      // Link creation fans out across modules, so one module may have
      // committed its link before another module fails. Clean up any links
      // that may have been written before rethrowing the original error.
      await link.dismiss(data)
      throw error
    }

    return new StepResponse(data, data)
  },
  async (createdLinks, { container }) => {
    if (!createdLinks) {
      return
    }

    const link = container.resolve<Link>(ContainerRegistrationKeys.LINK)
    await link.dismiss(createdLinks)
  }
)
