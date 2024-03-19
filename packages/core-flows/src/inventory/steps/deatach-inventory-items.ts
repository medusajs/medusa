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

    await remoteLink.delete({
      [Modules.INVENTORY]: { inventory_item_id: ids },
    })

    return new StepResponse(void 0, ids)
  },
  async (deatachedInventoryIds, { container }) => {
    if (!deatachedInventoryIds?.length) {
      return
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

    await remoteLink.restore({
      [Modules.INVENTORY]: { inventory_item_id: deatachedInventoryIds },
    })
  }
)
