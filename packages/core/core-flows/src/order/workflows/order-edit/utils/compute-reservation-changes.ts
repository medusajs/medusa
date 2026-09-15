import { BigNumberInput } from "@medusajs/framework/types"
import { ChangeActionType, MathBN } from "@medusajs/framework/utils"

/**
 * Works out, for a confirmed order edit, which line items need their
 * inventory reservation deleted (`toRemoveReservationLineItemIds`) and
 * which need a new reservation created for the unfulfilled remainder
 * (`items`/`variants`).
 *
 * A line only needs its reservation touched when the edit actually changed
 * its quantity (or added it) - a price-only or metadata-only update on an
 * already-fulfilled line has nothing to reserve or release. When a line
 * *is* reserved, the reservation is sized to the new quantity minus
 * whatever has already been fulfilled, so a partially or fully fulfilled
 * line doesn't get re-reserved at its full new quantity.
 */
export function computeReservationChangesForOrderEdit({
  refreshedOrder,
  previousOrderItems,
  orderPreview,
}: {
  refreshedOrder: { items: any[] }
  previousOrderItems: any[] | undefined
  orderPreview: { items?: any[] }
}): {
  variants: any[]
  items: { id: string; variant_id: string; quantity: BigNumberInput }[]
  toRemoveReservationLineItemIds: string[]
} {
  const allItems: { id: string; variant_id: string; quantity: BigNumberInput }[] =
    []
  const allVariants: any[] = []

  const previousItemIds = (previousOrderItems || []).map(({ id }) => id)
  const currentItemIds = refreshedOrder.items.map(({ id }) => id)

  const removedItemIds = previousItemIds.filter(
    (id) => !currentItemIds.includes(id)
  )

  const updatedItemIds: string[] = []

  refreshedOrder.items.forEach((ordItem) => {
    const itemAction = orderPreview.items?.find(
      (item) =>
        item.id === ordItem.id &&
        item.actions?.find(
          (a) =>
            a.action === ChangeActionType.ITEM_ADD ||
            a.action === ChangeActionType.ITEM_UPDATE
        )
    )

    if (!itemAction) {
      return
    }

    const isAddAction = !!itemAction.actions!.find(
      (a) => a.action === ChangeActionType.ITEM_ADD
    )
    const updateAction = itemAction.actions!.find(
      (a) => a.action === ChangeActionType.ITEM_UPDATE
    )

    const newQuantity: BigNumberInput =
      itemAction.raw_quantity ?? itemAction.quantity

    if (!isAddAction && updateAction) {
      const previousItem = (previousOrderItems || []).find(
        (i) => i.id === ordItem.id
      )
      const previousQuantity: BigNumberInput | undefined = previousItem
        ? previousItem.raw_quantity ?? previousItem.quantity
        : undefined

      if (
        previousItem &&
        previousQuantity !== undefined &&
        MathBN.eq(newQuantity, previousQuantity)
      ) {
        // The edit didn't change this item's quantity (e.g. a price-only
        // edit), so there's nothing to reserve or release for it -
        // touching inventory here would only re-reserve (or drop)
        // quantity that was never actually affected.
        return
      }
    }

    if (updateAction) {
      updatedItemIds.push(ordItem.id)
    }

    // fulfilled_quantity lives on the versioned item detail, not on the
    // line item itself - it has to be read from `.detail`, or it's always
    // undefined and this subtraction silently no-ops, causing the full
    // new quantity to be re-reserved even for lines that are already
    // partially or fully fulfilled.
    const fulfilledQuantity: BigNumberInput =
      ordItem.detail?.raw_fulfilled_quantity ??
      ordItem.detail?.fulfilled_quantity ??
      0

    const reservationQuantity = MathBN.sub(newQuantity, fulfilledQuantity)

    allItems.push({
      id: ordItem.id,
      variant_id: ordItem.variant_id,
      quantity: reservationQuantity,
    })
    allVariants.push(ordItem.variant)
  })

  return {
    variants: allVariants,
    items: allItems,
    toRemoveReservationLineItemIds: [...removedItemIds, ...updatedItemIds],
  }
}
