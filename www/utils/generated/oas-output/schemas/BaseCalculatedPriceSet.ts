/**
 * @schema BaseCalculatedPriceSet
 * type: object
 * description: The calculated price's details.
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
 *     description: Whether the calculated price belongs to a price list.
 *   is_calculated_price_tax_inclusive:
 *     type: boolean
 *     title: is_calculated_price_tax_inclusive
 *     description: Whether the calculated price is tax inclusive.
 *   calculated_amount:
 *     type: number
 *     title: calculated_amount
 *     description: The amount of the calculated price, or `null` if there isn't a calculated price. This is the amount shown to the customer.
 *   calculated_amount_with_tax:
 *     type: number
 *     title: calculated_amount_with_tax
 *     description: The calculated price's amount with taxes applied.
 *   calculated_amount_without_tax:
 *     type: number
 *     title: calculated_amount_without_tax
 *     description: The calculated price's amount without taxes applied.
 *   is_original_price_price_list:
 *     type: boolean
 *     title: is_original_price_price_list
 *     description: Whether the original price belongs to a price list.
 *   is_original_price_tax_inclusive:
 *     type: boolean
 *     title: is_original_price_tax_inclusive
 *     description: Whether the original price is tax inclusive.
 *   original_amount:
 *     type: number
 *     title: original_amount
 *     description: The amount of the original price, or `null` if there isn't an original price. This amount is useful to compare with the `calculated_amount`, such as to check for discounted value.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The calculated price's currency code.
 *     example: usd
 *   calculated_price:
 *     type: object
 *     description: The calculated price's details.
 *   original_price:
 *     type: object
 *     description: The original price's details.
 * 
*/

