/**
 * Convert a collection of dot string into a nested object
 * @example
 * input: [
 *    order,
 *    order.items,
 *    order.swaps,
 *    order.swaps.additional_items,
 *    order.discounts,
 *    order.discounts.rule,
 *    order.claims,
 *    order.claims.additional_items,
 *    additional_items,
 *    additional_items.variant,
 *    return_order,
 *    return_order.items,
 *    return_order.shipping_method,
 *    return_order.shipping_method.tax_lines
 * ]
 * output: {
 *   "order": {
 *     "items": true,
 *     "swaps": {
 *       "additional_items": true
 *     },
 *     "discounts": {
 *       "rule": true
 *     },
 *     "claims": {
 *       "additional_items": true
 *     }
 *   },
 *   "additional_items": {
 *     "variant": true
 *   },
 *   "return_order": {
 *     "items": true,
 *     "shipping_method": {
 *       "tax_lines": true
 *     }
 *   }
 * }
 * @param collection
 */
export declare function objectFromStringPath(collection: string[]): Record<string, any>;
