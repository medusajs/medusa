import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deAttachInventoryItemStepId = "deattach-inventory-items-step"
export const deAttachInventoryItemStep = createStep(
  deAttachInventoryItemStepId,
  async (ids: string[], { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const links = (await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "product_variant_inventory_item",
        variables: {
          filter: { inventory_item_id: ids },
          take: 2,
        },
        fields: ["variant_id", "inventory_item_id"],
      })
    )) as { variant_id: string; inventory_item_id: string }[]

    await remoteLink.dismiss(
      links.map(({ inventory_item_id, variant_id }) => ({
        productService: {
          variant_id,
        },
        inventoryService: {
          inventory_item_id,
        },
      }))
    )

    return new StepResponse(void 0, links)
  },
  async (input, { container }) => {
    if (!input?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkDefinitions = input.map(({ inventory_item_id, variant_id }) => ({
      productService: {
        variant_id,
      },
      inventoryService: {
        inventory_item_id,
      },
    }))

    const links = await remoteLink.create(linkDefinitions)
  }
)
