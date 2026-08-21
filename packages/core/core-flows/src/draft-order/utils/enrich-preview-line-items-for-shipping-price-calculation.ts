/**
 * Shared helpers for resolving calculated shipping prices on a draft order from
 * its *projected* state (base order + pending order-change actions), rather than
 * its materialized items.
 *
 * During a draft order edit the order stays at its current version while pending
 * item changes live at the next version, visible only through `previewOrderChange`.
 * A materialized `order -> items` query therefore reflects none of the pending
 * changes, so calculated shipping must be priced against the projected items.
 */

/**
 * Shipping option fields the fulfillment provider needs to calculate a price.
 */
export const SHIPPING_OPTION_FIELDS_FOR_PRICE_CALCULATION = [
  "id",
  "name",
  "price_type",
  "provider_id",
  "data",
  "shipping_profile_id",
  "service_zone.fulfillment_set.location.*",
  "service_zone.fulfillment_set.location.address.*",
]

/**
 * Line item fields the fulfillment provider needs to calculate a price.
 */
export const LINE_ITEM_FIELDS_FOR_SHIPPING_PRICE_CALCULATION = [
  "id",
  "quantity",
  "variant_id",
  "variant.id",
  "variant.weight",
  "variant.length",
  "variant.height",
  "variant.width",
  "variant.material",
  "variant.product.id",
  "variant.product.shipping_profile.id",
  "product.id",
]

/**
 * Builds the `context.items` array for a calculated shipping price by merging
 * projected quantities (from the preview) with variant data (from line items).
 */
export function enrichPreviewLineItemsForShippingPriceCalculation(
  previewItems: any[] | undefined,
  lineItems: any[] | undefined
): any[] {
  const lineItemsById = new Map((lineItems ?? []).map((li) => [li.id, li]))

  return (previewItems ?? []).map((item) => {
    const lineItem = lineItemsById.get(item.id)
    return {
      ...item,
      quantity: item.quantity,
      variant: lineItem?.variant,
      product: lineItem?.variant?.product ?? lineItem?.product,
    }
  })
}
