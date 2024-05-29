import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ContainerRegistrationKeys } from "@medusajs/utils"

export const attachInventoryItemToVariantsStepId =
  "attach-inventory-items-to-variants-step"
export const attachInventoryItemToVariants = createStep(
  attachInventoryItemToVariantsStepId,
  async (
    input: {
      variant_id: string
      inventory_item_id: string
    }[],
    { container }
  ) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkDefinitions = input.map(({ inventory_item_id, variant_id }) => ({
      productService: { variant_id },
      inventoryService: { inventory_item_id },
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
