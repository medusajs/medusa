/**
 * @schema StoreCalculatedPrice
 * type: object
 * description: The shipping option's calculated price.
 * x-schemaName: StoreCalculatedPrice
 * required:
 *   - id
 *   - calculated_amount
 *   - original_amount
 *   - original_amount_with_tax
 *   - original_amount_without_tax
 *   - currency_code
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The calculated price's ID.
 *   is_calculated_price_price_list:
 *     type: boolean
 *     title: is_calculated_price_price_list
 *     description: The calculated price's is calculated price price list.
 *   is_calculated_price_tax_inclusive:
 *     type: boolean
 *     title: is_calculated_price_tax_inclusive
 *     description: The calculated price's is calculated price tax inclusive.
 *   calculated_amount:
 *     type: number
 *     title: calculated_amount
 *     description: The calculated price's calculated amount.
 *   calculated_amount_with_tax:
 *     type: number
 *     title: calculated_amount_with_tax
 *     description: The calculated price's calculated amount with tax.
 *   calculated_amount_without_tax:
 *     type: number
 *     title: calculated_amount_without_tax
 *     description: The calculated price's calculated amount without tax.
 *   is_original_price_price_list:
 *     type: boolean
 *     title: is_original_price_price_list
 *     description: The calculated price's is original price price list.
 *   is_original_price_tax_inclusive:
 *     type: boolean
 *     title: is_original_price_tax_inclusive
 *     description: The calculated price's is original price tax inclusive.
 *   original_amount:
 *     type: number
 *     title: original_amount
 *     description: The calculated price's original amount.
 *   original_amount_with_tax:
 *     type: number
 *     title: original_amount_with_tax
 *     description: The calculated price's original amount with tax.
 *   original_amount_without_tax:
 *     type: number
 *     title: original_amount_without_tax
 *     description: The calculated price's original amount without tax.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The calculated price's currency code.
 *   calculated_price:
 *     type: object
 *     description: The calculated price's details.
 *     required:
 *       - id
 *       - price_list_id
 *       - price_list_type
 *       - min_quantity
 *       - max_quantity
 *     properties:
 *       id:
 *         type: string
 *         title: id
 *         description: The calculated price's ID.
 *       price_list_id:
 *         type: string
 *         title: price_list_id
 *         description: The calculated price's price list id.
 *       price_list_type:
 *         type: string
 *         title: price_list_type
 *         description: The calculated price's price list type.
 *       min_quantity:
 *         type: number
 *         title: min_quantity
 *         description: The calculated price's min quantity.
 *       max_quantity:
 *         type: number
 *         title: max_quantity
 *         description: The calculated price's max quantity.
 *   original_price:
 *     type: object
 *     description: The calculated price's original price.
 *     required:
 *       - id
 *       - price_list_id
 *       - price_list_type
 *       - min_quantity
 *       - max_quantity
 *     properties:
 *       id:
 *         type: string
 *         title: id
 *         description: The original price's ID.
 *       price_list_id:
 *         type: string
 *         title: price_list_id
 *         description: The original price's price list id.
 *       price_list_type:
 *         type: string
 *         title: price_list_type
 *         description: The original price's price list type.
 *       min_quantity:
 *         type: number
 *         title: min_quantity
 *         description: The original price's min quantity.
 *       max_quantity:
 *         type: number
 *         title: max_quantity
 *         description: The original price's max quantity.
 * 
*/

