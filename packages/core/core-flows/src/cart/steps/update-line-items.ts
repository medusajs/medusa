import {
  ICartModuleService,
  UpdateLineItemWithoutSelectorDTO,
  UpdateLineItemWithSelectorDTO,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the line items to update.
 */
export interface UpdateLineItemsStepInput {
  /**
   * The ID of the cart that the line items belong to.
   */
  id: string
  /**
   * The line items to update.
   */
  items: (UpdateLineItemWithSelectorDTO | UpdateLineItemWithoutSelectorDTO)[]
}

export const updateLineItemsStepId = "update-line-items-step"
/**
 * This step updates a cart's line items.
 *
 * @example
 * const data = updateLineItemsStep({
 *   id: "cart_123",
 *   items: [
 *     {
 *       selector: {
 *         id: "line_item_123"
 *       },
 *       data: {
 *         quantity: 2
 *       }
 *     }
 *   ]
 * })
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
      items.map((item) => ("data" in item ? item.data : item))
    )

    const itemsBeforeUpdate = await cartModule.listLineItems(
      { id: items.map((d) => ("selector" in d ? d.selector.id! : d.id!)) },
      { select: selects, relations }
    )

    const updatedItems = items.length
      ? await cartModule.updateLineItems(
          items as UpdateLineItemWithoutSelectorDTO[]
        )
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
