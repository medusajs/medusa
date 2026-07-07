/**
 * @schema AdminUpdateShippingOptionPriceWithCurrency
 * type: object
 * description: The properties to update in a shipping option price with a currency.
 * x-schemaName: AdminUpdateShippingOptionPriceWithCurrency
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The price's ID.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The price's currency code.
 *     example: usd
 *   amount:
 *     type: number
 *     title: amount
 *     description: The price's amount.
 *   rules:
 *     type: array
 *     description: The price's rules.
 *     items:
 *       $ref: "#/components/schemas/PriceRule"
 * 
*/

