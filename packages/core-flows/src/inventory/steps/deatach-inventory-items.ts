import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ILinkModule } from "@medusajs/types"

export const deatachInventoryItemStepId = "deattach-inventory-items-step"
export const deatachInventoryItemStep = createStep(
  deatachInventoryItemStepId,
  async (ids: string[], { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    const linkModule: ILinkModule = remoteLink.getLinkModule(
      Modules.PRODUCT,
      "variant_id",
      Modules.INVENTORY,
      "inventory_item_id"
    )

    const links = (await linkModule.list(
      { inventory_item_id: ids },
      { select: ["variant_id", "inventory_item_id"] }
    )) as { inventory_item_id: string; variant_id: string }[]

    await remoteLink.dismiss(
      links.map(({ inventory_item_id, variant_id }) => ({
        [Modules.PRODUCT]: {
          variant_id,
        },
        [Modules.INVENTORY]: {
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
      [Modules.PRODUCT]: {
        variant_id,
      },
      [Modules.INVENTORY]: {
        inventory_item_id,
      },
    }))

    const links = await remoteLink.create(linkDefinitions)
  }
)
