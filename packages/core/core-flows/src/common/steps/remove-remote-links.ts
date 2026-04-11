import { DeleteEntityInput, Link } from "@medusajs/framework/modules-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type RemoveRemoteLinksStepInput = DeleteEntityInput | DeleteEntityInput[]

export const removeRemoteLinkStepId = "remove-remote-links"
/**
 * This step deletes linked records of a record if cascade deletion is enabled.
 *
 * Learn more in the [Link documentation](https://docs.medusajs.com/learn/fundamentals/module-links/link#cascade-delete-linked-records)
 *
 * @example
 * removeRemoteLinkStep([{
 *   [Modules.PRODUCT]: {
 *     product_id: "prod_123",
 *   },
 * }])
 */
export const removeRemoteLinkStep = createStep(
  removeRemoteLinkStepId,
  async (data: RemoveRemoteLinksStepInput, { container }) => {
    const entries = Array.isArray(data) ? data : [data]

    if (!entries.length) {
      return new StepResponse(void 0)
    }

    const grouped: DeleteEntityInput = {}

    for (const entry of entries) {
      for (const moduleName of Object.keys(entry)) {
        grouped[moduleName] ??= {}

        for (const linkableKey of Object.keys(entry[moduleName])) {
          grouped[moduleName][linkableKey] ??= []

          const keys = Array.isArray(entry[moduleName][linkableKey])
            ? entry[moduleName][linkableKey]
            : [entry[moduleName][linkableKey]]

          grouped[moduleName][linkableKey] = (
            grouped[moduleName][linkableKey] as string[]
          ).concat(keys as string[])
        }
      }
    }

    const link = container.resolve<Link>(ContainerRegistrationKeys.LINK)
    await link.delete(grouped)

    return new StepResponse(grouped, grouped)
  },
  async (removedLinks, { container }) => {
    if (!removedLinks) {
      return
    }

    const link = container.resolve<Link>(ContainerRegistrationKeys.LINK)
    await link.restore(removedLinks)
  }
)
