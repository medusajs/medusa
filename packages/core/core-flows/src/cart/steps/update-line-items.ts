import {
  ICartModuleService,
  UpdateLineItemWithSelectorDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface UpdateLineItemsStepInput {
  id: string
  items: UpdateLineItemWithSelectorDTO[]
}

export const updateLineItemsStepId = "update-line-items-step"
/**
 * This step updates a cart's line items.
 */
export const updateLineItemsStep = createStep(
  updateLineItemsStepId,
  async (input: UpdateLineItemsStepInput, { container }) => {
    const { items = [] } = input

    if (!items?.length) {
      return new StepResponse([], [])
    }

    const cartModule = container.resolve<ICartModuleService>(Modules.CART)

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

    const cartModule: ICartModuleService = container.resolve(Modules.CART)

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
