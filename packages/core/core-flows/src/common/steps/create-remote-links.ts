import { LinkDefinition, RemoteLink } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export const createLinksStepId = "create-remote-links"
/**
 * This step creates remote links between two records of linked data models.
 * 
 * Learn more in the [Remote Link documentation.](https://docs.medusajs.com/v2/advanced-development/modules/remote-link#create-link).
 * 
 * @example
 * import { 
 *   createWorkflow
 * } from "@medusajs/workflows-sdk"
 * import {
 *   createRemoteLinkStep
 * } from "@medusajs/core-flows"
 * import {
 *   Modules
 * } from "@medusajs/utils"
 * 
 * const helloWorldWorkflow = createWorkflow(
 *   "hello-world",
 *   () => {
 *     createRemoteLinkStep([{
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
export const createRemoteLinkStep = createStep(
  createLinksStepId,
  async (data: LinkDefinition[], { container }) => {
    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )

    if (!data.length) {
      return new StepResponse([], [])
    }

    await link.create(data)

    return new StepResponse(data, data)
  },
  async (createdLinks, { container }) => {
    if (!createdLinks) {
      return
    }

    const link = container.resolve<RemoteLink>(
      ContainerRegistrationKeys.REMOTE_LINK
    )
    await link.dismiss(createdLinks)
  }
)
