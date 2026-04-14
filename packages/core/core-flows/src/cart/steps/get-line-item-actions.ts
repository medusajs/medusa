import {
  CartLineItemDTO,
  CreateLineItemForCartDTO,
  ICartModuleService,
  UpdateLineItemWithoutSelectorDTO,
  UpdateLineItemWithSelectorDTO,
} from "@medusajs/framework/types"
import {
  MathBN,
  Modules,
  deepEqualObj,
  isPresent,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the line items to create or update.
 */
export interface GetLineItemActionsStepInput {
  /**
   * The ID of the cart to create line items for.
   */
  id: string
  /**
   * The line items to create or update.
   */
  items: CreateLineItemForCartDTO[]
}

export interface GetLineItemActionsStepOutput {
  /**
   * The line items to create.
   */
  itemsToCreate: CreateLineItemForCartDTO[]
  /**
   * The line items to update.
   */
  itemsToUpdate:
    | UpdateLineItemWithSelectorDTO[]
    | UpdateLineItemWithoutSelectorDTO[]
}

export const getLineItemActionsStepId = "get-line-item-actions-step"
/**
 * This step returns lists of cart line items to create or update based on the
 * provided input.
 *
 * @example
 * const data = getLineItemActionsStep({
 *   "id": "cart_123",
 *   "items": [{
 *     "title": "Shirt",
 *     "quantity": 1,
 *     "unit_price": 50,
 *     "cart_id": "cart_123",
 *   }]
 * })
 */
export const getLineItemActionsStep = createStep(
  getLineItemActionsStepId,
  async (data: GetLineItemActionsStepInput, { container }) => {
    if (!data.items.length) {
      return new StepResponse({ itemsToCreate: [], itemsToUpdate: [] }, null)
    }

    const cartModule = container.resolve<ICartModuleService>(Modules.CART)

    const variantIds = data.items.map((d) => d.variant_id!)
    const existingVariantItems = await cartModule.listLineItems(
      {
        cart_id: data.id,
        variant_id: variantIds,
      },
      {
        select: [
          "id",
          "metadata",
          "variant_id",
          "quantity",
          "unit_price",
          "compare_at_unit_price",
        ],
      }
    )

    const variantItemsMap = existingVariantItems.reduce(
      (result, variantItem) => {
        if (!result.has(variantItem.variant_id!)) {
          result.set(variantItem.variant_id!, [])
        }
        result.get(variantItem.variant_id!)!.push(variantItem)
        return result
      },
      new Map<string, CartLineItemDTO[]>()
    )

    const itemsToCreate: CreateLineItemForCartDTO[] = []
    const itemsToUpdate: UpdateLineItemWithSelectorDTO["data"][] = []

    const metadataMatches = (
      existingItem: CartLineItemDTO,
      newItem: CreateLineItemForCartDTO
    ) =>
      (!isPresent(existingItem?.metadata) && !isPresent(newItem.metadata)) ||
      deepEqualObj(existingItem?.metadata, newItem.metadata)

    for (const item of data.items) {
      const variantItems = variantItemsMap.get(item.variant_id!)

      const existingItem = variantItems?.find((existingItem) =>
        item.is_custom_price
          ? metadataMatches(existingItem, item) &&
            item.unit_price === existingItem.unit_price
          : metadataMatches(existingItem, item) && !existingItem.is_custom_price
      )

      if (existingItem) {
        const quantity = MathBN.sum(
          existingItem.quantity as number,
          item.quantity ?? 1
        )

        // In case of multiple items with the same variant_id, metadata and custom price, we accumulate the quantity.
        existingItem.quantity = quantity

        const existingUpdate = itemsToUpdate.find(
          (u) => u.id === existingItem.id
        )

        if (existingUpdate) {
          existingUpdate.quantity = quantity
        } else {
          itemsToUpdate.push({
            id: existingItem.id,
            quantity: quantity,
            variant_id: item.variant_id!,
            unit_price: item.unit_price ?? existingItem.unit_price,
            compare_at_unit_price:
              item.compare_at_unit_price ?? existingItem.compare_at_unit_price,
          })
        }
      } else {
        itemsToCreate.push(item)
      }
    }

    return new StepResponse(
      { itemsToCreate, itemsToUpdate } as GetLineItemActionsStepOutput,
      null
    )
  }
)
