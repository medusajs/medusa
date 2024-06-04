import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  UpdateLineItemWithSelectorDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

interface StepInput {
  id: string
  items: UpdateLineItemWithSelectorDTO[]
}

export const updateLineItemsStepId = "update-line-items-step"
export const updateLineItemsStep = createStep(
  updateLineItemsStepId,
  async (input: StepInput, { container }) => {
    const { id, items = [] } = input

    if (!items?.length) {
      return new StepResponse([], [])
    }

    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(
      items.map((item) => item.data)
    )

    const itemsBeforeUpdate = await cartModule.listLineItems(
      { id: items.map((d) => d.selector.id!) },
      { select: selects, relations }
    )

    const updatedItems = items.length
      ? await cartModule.updateLineItems(items)
      : []

    return new StepResponse(updatedItems, itemsBeforeUpdate)
  },
  async (itemsBeforeUpdate, { container }) => {
    if (!itemsBeforeUpdate?.length) {
      return
    }

    const cartModule: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    if (itemsBeforeUpdate.length) {
      const itemsToUpdate: UpdateLineItemWithSelectorDTO[] = []

      for (const item of itemsBeforeUpdate) {
        const { id, ...data } = item

        itemsToUpdate.push({ selector: { id }, data })
      }

      await cartModule.updateLineItems(itemsToUpdate)
    }
  }
)
