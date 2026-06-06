import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/framework/utils"

/**
 * The data to attach inventory items to variants.
 */
export type AttachInventoryItemToVariantsStepInput = {
  /**
   * The inventory item ID to attach to the variant.
   */
  inventoryItemId: string
  /**
   * The variant ID to attach the inventory item to.
   */
  tag: string
}[]

export const attachInventoryItemToVariantsStepId =
  "attach-inventory-items-to-variants-step"
/**
 * This step creates one or more links between variant and inventory item records.
 * 
 * @example
 * const data = attachInventoryItemToVariants([
 *   {
 *     inventoryItemId: "iitem_123",
 *     tag: "variant_123"
 *   }
 * ])
 */
export const attachInventoryItemToVariants = createStep(
  attachInventoryItemToVariantsStepId,
  async (
    input: AttachInventoryItemToVariantsStepInput,
    { container }
  ) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

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

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    await remoteLink.dismiss(linkDefinitions)
  }
)
