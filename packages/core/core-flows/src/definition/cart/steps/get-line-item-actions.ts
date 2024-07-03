import {
  CartLineItemDTO,
  CreateLineItemForCartDTO,
  ICartModuleService,
  UpdateLineItemWithSelectorDTO,
} from "@medusajs/types"
import {
  MathBN,
  ModuleRegistrationName,
  deepEqualObj,
  isPresent,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  id: string
  items: CreateLineItemForCartDTO[]
}

export const getLineItemActionsStepId = "get-line-item-actions-step"
export const getLineItemActionsStep = createStep(
  getLineItemActionsStepId,
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

    return new StepResponse({ itemsToCreate, itemsToUpdate }, null)
  }
)
