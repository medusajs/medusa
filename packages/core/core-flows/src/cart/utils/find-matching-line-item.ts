import { BigNumberInput, CartLineItemDTO } from "@medusajs/framework/types"
import { deepEqualObj, isPresent } from "@medusajs/framework/utils"

/**
 * The properties of a new line item that determine whether it can be merged
 * into an existing cart line item.
 *
 * @since 2.18.1
 */
export interface MatchableLineItem {
  metadata?: Record<string, unknown> | null
  unit_price?: BigNumberInput
  is_custom_price?: boolean
}

type ExistingLineItem = Pick<
  CartLineItemDTO,
  "metadata" | "unit_price" | "is_custom_price"
>

const metadataMatches = (
  existingItem: Pick<CartLineItemDTO, "metadata">,
  newItem: MatchableLineItem
) =>
  (!isPresent(existingItem?.metadata) && !isPresent(newItem.metadata)) ||
  deepEqualObj(existingItem?.metadata, newItem.metadata)

/**
 * The line item fields that must be selected when looking for existing cart
 * line items a new item can be merged into.
 *
 * @since 2.18.1
 */
export const lineItemFieldsForMerging = [
  "id",
  "metadata",
  "variant_id",
  "quantity",
  "unit_price",
  "compare_at_unit_price",
  "is_custom_price",
]

/**
 * Finds the line item, among the existing items of the same variant, that a new
 * item should be merged into. Items are merged when their metadata matches and
 * either both carry the same custom price, or neither has a custom price.
 *
 * @since 2.18.1
 */
export function findMatchingLineItem<T extends ExistingLineItem>(
  existingItems: T[] | undefined,
  newItem: MatchableLineItem
): T | undefined {
  return existingItems?.find((existingItem) =>
    newItem.is_custom_price
      ? metadataMatches(existingItem, newItem) &&
        newItem.unit_price === existingItem.unit_price
      : metadataMatches(existingItem, newItem) && !existingItem.is_custom_price
  )
}
