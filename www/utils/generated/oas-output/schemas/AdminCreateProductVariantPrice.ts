/**
 * @schema AdminCreateProductVariantPrice
 * type: object
 * description: The details of a variant's price.
 * x-schemaName: AdminCreateProductVariantPrice
 * required:
 *   - currency_code
 *   - amount
 * properties:
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The price's currency code.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The price's amount.
 *   min_quantity:
 *     type: number
 *     title: min_quantity
 *     description: The minimum quantity that must be available in the cart for this price to apply.
 *   max_quantity:
 *     type: number
 *     title: max_quantity
 *     description: The maximum quantity that must not be surpassed in the cart for this price to apply.
 *   rules:
 *     type: object
 *     description: The price's rules.
 *     example:
 *       region_id: reg_123
 *     properties:
 *       region_id:
 *         type: string
 *         title: region_id
 *         description: The ID of a region.
 *     required:
 *       - region_id
 * 
*/

