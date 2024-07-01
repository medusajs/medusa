/**
 * @schema AdminCreatePriceList
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCreatePriceList
 * required:
 *   - title
 *   - description
 *   - starts_at
 *   - ends_at
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The price list's title.
 *   description:
 *     type: string
 *     title: description
 *     description: The price list's description.
 *   starts_at:
 *     type: string
 *     title: starts_at
 *     description: The price list's starts at.
 *   ends_at:
 *     type: string
 *     title: ends_at
 *     description: The price list's ends at.
 *   status:
 *     type: string
 *     enum:
 *       - active
 *       - draft
 *   type:
 *     type: string
 *     enum:
 *       - sale
 *       - override
 *   rules:
 *     type: object
 *     description: The price list's rules.
 *   prices:
 *     type: array
 *     description: The price list's prices.
 *     items:
 *       type: object
 *       description: The price's prices.
 *       required:
 *         - currency_code
 *         - amount
 *         - variant_id
 *         - min_quantity
 *         - max_quantity
 *       properties:
 *         currency_code:
 *           type: string
 *           title: currency_code
 *           description: The price's currency code.
 *         amount:
 *           type: number
 *           title: amount
 *           description: The price's amount.
 *         variant_id:
 *           type: string
 *           title: variant_id
 *           description: The price's variant id.
 *         min_quantity:
 *           type: number
 *           title: min_quantity
 *           description: The price's min quantity.
 *         max_quantity:
 *           type: number
 *           title: max_quantity
 *           description: The price's max quantity.
 *         rules:
 *           type: object
 *           description: The price's rules.
 * 
*/

