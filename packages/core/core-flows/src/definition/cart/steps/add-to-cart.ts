import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CartLineItemDTO,
  CreateLineItemForCartDTO,
  ICartModuleService,
  UpdateLineItemWithSelectorDTO,
} from "@medusajs/types"
import { deepEqualObj, isPresent, MathBN } from "@medusajs/utils"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

interface StepInput {
  id: string
  items: CreateLineItemForCartDTO[]
}

export const addToCartStepId = "add-to-cart-step"
export const addToCartStep = createStep(
  addToCartStepId,
  async (data: StepInput, { container }) => {
    const cartModule = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const existingVariantItems = await cartModule.listLineItems({
      cart_id: data.id,
      variant_id: data.items.map((d) => d.variant_id!),
    })

    const variantItemMap = new Map<string, CartLineItemDTO>(
      existingVariantItems.map((item) => [item.variant_id!, item])
    )

    const itemsToCreate: CreateLineItemForCartDTO[] = []
    const itemsToUpdate: UpdateLineItemWithSelectorDTO[] = []

    for (const item of data.items) {
      const existingItem = variantItemMap.get(item.variant_id!)
      const metadataMatches =
        (!isPresent(existingItem?.metadata) && !isPresent(item.metadata)) ||
        deepEqualObj(existingItem?.metadata, item.metadata)

      if (existingItem && metadataMatches) {
        const quantity = MathBN.sum(
          existingItem.quantity as number,
          item.quantity || 1
        ).toNumber()

        itemsToUpdate.push({
          selector: { id: existingItem.id },
          data: { id: existingItem.id, quantity: quantity },
        })
      } else {
        itemsToCreate.push(item)
      }
    }

    const createdItems = itemsToCreate.length
      ? await cartModule.addLineItems(itemsToCreate)
      : []

    const itemsBeforeUpdate = await cartModule.listLineItems(
      { id: itemsToUpdate.map((d) => d.selector.id!) },
      { select: ["id", "quantity"] }
    )

    const updatedItems = itemsToUpdate.length
      ? await cartModule.updateLineItems(itemsToUpdate)
      : []

    return new StepResponse([...createdItems, ...updatedItems], {
      createdItems,
      itemsBeforeUpdate,
    })
  },
  async (revertData, { container }) => {
    if (!revertData) {
      return
    }

    const { createdItems, itemsBeforeUpdate } = revertData

    const cartModule: ICartModuleService = container.resolve(
      ModuleRegistrationName.CART
    )

    if (createdItems.length) {
      await cartModule.deleteLineItems(createdItems.map((c) => c.id))
    }

    if (itemsBeforeUpdate.length) {
      const itemsToUpdate: UpdateLineItemWithSelectorDTO[] = []

      for (const item of itemsBeforeUpdate) {
        itemsToUpdate.push({
          selector: { id: item.id },
          data: { id: item.id, quantity: item.quantity },
        })
      }

      await cartModule.updateLineItems(itemsToUpdate)
    }
  }
)
