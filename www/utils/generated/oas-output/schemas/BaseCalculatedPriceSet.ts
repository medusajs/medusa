/**
 * @schema BaseCalculatedPriceSet
 * type: object
 * description: The updated's calculated price.
 * x-schemaName: BaseCalculatedPriceSet
 * required:
 *   - id
 *   - calculated_amount
 *   - original_amount
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
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The calculated price's currency code.
 *   calculated_price:
 *     type: object
 *     description: The calculated price's details.
 *   original_price:
 *     type: object
 *     description: The calculated price's original price.
 * 
*/

