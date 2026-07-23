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
 *     description: The ID of the price set from which the price was selected.
 *   is_calculated_price_price_list:
 *     type: boolean
 *     title: is_calculated_price_price_list
 *     description: Whether the calculated price belongs to a price list.
 *   is_calculated_price_tax_inclusive:
 *     type: boolean
 *     title: is_calculated_price_tax_inclusive
 *     description: Whether the calculated price is tax inclusive.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing
 *   calculated_amount:
 *     type: number
 *     title: calculated_amount
 *     description: The amount of the calculated price, or `null` if there isn't a calculated price. This is the amount shown to the customer.
 *   calculated_amount_with_tax:
 *     type: number
 *     title: calculated_amount_with_tax
 *     description: The `calculated_amount` with taxes applied.
 *   calculated_amount_without_tax:
 *     type: number
 *     title: calculated_amount_without_tax
 *     description: The `calculated_amount` without taxes applied.
 *   is_original_price_price_list:
 *     type: boolean
 *     title: is_original_price_price_list
 *     description: Whether the original price belongs to a price list.
 *   is_original_price_tax_inclusive:
 *     type: boolean
 *     title: is_original_price_tax_inclusive
 *     description: Whether the original price is tax inclusive.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing
 *   original_amount:
 *     type: number
 *     title: original_amount
 *     description: The amount of the original price, or `null` if there isn't an original price. This amount is useful to compare with the `calculated_amount`, such as to check for discounted value.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The currency code of the calculated price, or `null` if there isn't a calculated price.
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
 *         description: The ID of the price.
 *       price_list_id:
 *         type: string
 *         title: price_list_id
 *         description: The ID of the associated price list.
 *       price_list_type:
 *         type: string
 *         title: price_list_type
 *         description: The price list's type. For example, `sale` or `override`.
 *       min_quantity:
 *         type: number
 *         title: min_quantity
 *         description: The minimum quantity required in the cart for the price to apply.
 *       max_quantity:
 *         type: number
 *         title: max_quantity
 *         description: The maximum quantity required in the cart for the price to apply.
 *   original_price:
 *     type: object
 *     description: The origin price's details.
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
 *         description: The ID of the price.
 *       price_list_id:
 *         type: string
 *         title: price_list_id
 *         description: The ID of the associated price list.
 *       price_list_type:
 *         type: string
 *         title: price_list_type
 *         description: The price list's type. For example, `sale` or `override`.
 *       min_quantity:
 *         type: number
 *         title: min_quantity
 *         description: The minimum quantity required in the cart for the price to apply.
 *       max_quantity:
 *         type: number
 *         title: max_quantity
 *         description: The maximum quantity required in the cart for the price to apply.
 *   original_amount_with_tax:
 *     type: number
 *     title: original_amount_with_tax
 *     description: The original amount with taxes applied.
 *   original_amount_without_tax:
 *     type: number
 *     title: original_amount_without_tax
 *     description: The original amount without taxes.
 * 
*/

