import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const attachInventoryItemToVariantsStepId =
  "attach-inventory-items-to-variants-step"
/**
 * This step creates one or more links between variant and inventory item records.
 */
export const attachInventoryItemToVariants = createStep(
  attachInventoryItemToVariantsStepId,
  async (
    input: {
      inventoryItemId: string
      tag?: string
    }[],
    { container }
  ) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkDefinitions = input
      .filter(({ tag }) => !!tag)
      .map(({ inventoryItemId, tag }) => ({
        [Modules.PRODUCT]: {
          variant_id: tag!,
        },
        [Modules.INVENTORY]: {
          inventory_item_id: inventoryItemId,
        },
      }))

    const links = await remoteLink.create(linkDefinitions)

    return new StepResponse(links, linkDefinitions)
  },
  async (linkDefinitions, { container }) => {
    if (!linkDefinitions?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    await remoteLink.dismiss(linkDefinitions)
  }
)
