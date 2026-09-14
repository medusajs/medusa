import {
  BigNumberInput,
  CartLineItemDTO,
  ICartModuleService,
} from "@medusajs/framework/types"
import { MathBN, Modules, isDefined } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import {
  findMatchingLineItem,
  lineItemFieldsForMerging,
} from "../utils/find-matching-line-item"

/**
 * The details of the items to resolve pricing quantities for.
 */
export interface GetLineItemPricingQuantitiesStepInput {
  /**
   * The ID of the cart the items are added to.
   */
  id: string
  /**
   * The items being added to the cart.
   */
  items?: {
    variant_id?: string
    quantity?: BigNumberInput
    unit_price?: BigNumberInput
    metadata?: Record<string, unknown> | null
  }[]
}

export const getLineItemPricingQuantitiesStepId =
  "get-line-item-pricing-quantities"
/**
 * This step resolves the quantity that each item added to a cart must be priced
 * for. When an item is merged into an existing line item of the cart, its price
 * has to be selected for the resulting total quantity, not only for the added
 * quantity. Otherwise, quantity-based prices (such as price list tiers) are
 * resolved against the wrong quantity.
 *
 * The returned quantities are aligned, by index, with the input items.
 *
 * @example
 * const quantities = getLineItemPricingQuantitiesStep({
 *   "id": "cart_123",
 *   "items": [{
 *     "variant_id": "variant_123",
 *     "quantity": 1,
 *   }]
 * })
 */
export const getLineItemPricingQuantitiesStep = createStep(
  getLineItemPricingQuantitiesStepId,
  async (data: GetLineItemPricingQuantitiesStepInput, { container }) => {
    const items = data.items ?? []
    const quantities = items.map((item) =>
      MathBN.convert(item.quantity ?? 1).toNumber()
    )

    const variantIds = items
      .map((item) => item.variant_id)
      .filter((id): id is string => !!id)

    if (!variantIds.length) {
      return new StepResponse(quantities)
    }

    const cartModule = container.resolve<ICartModuleService>(Modules.CART)

    const existingVariantItems = await cartModule.listLineItems(
      {
        cart_id: data.id,
        variant_id: variantIds,
      },
      {
        select: lineItemFieldsForMerging,
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

    items.forEach((item, index) => {
      if (!item.variant_id) {
        return
      }

      const existingItem = findMatchingLineItem(
        variantItemsMap.get(item.variant_id),
        {
          metadata: item.metadata,
          unit_price: item.unit_price,
          is_custom_price: isDefined(item.unit_price),
        }
      )

      if (!existingItem) {
        return
      }

      const quantity = MathBN.sum(
        existingItem.quantity as number,
        item.quantity ?? 1
      )

      // In case of multiple items merging into the same line item, the
      // quantities accumulate, the same way they do when the items are updated.
      existingItem.quantity = quantity

      quantities[index] = quantity.toNumber()
    })

    return new StepResponse(quantities)
  }
)
