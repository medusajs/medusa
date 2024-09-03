/**
 * @schema AdminCreateShippingOption
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCreateShippingOption
 * required:
 *   - name
 *   - service_zone_id
 *   - shipping_profile_id
 *   - price_type
 *   - provider_id
 *   - type
 *   - prices
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The shipping option's name.
 *   service_zone_id:
 *     type: string
 *     title: service_zone_id
 *     description: The shipping option's service zone id.
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The shipping option's shipping profile id.
 *   data:
 *     type: object
 *     description: The shipping option's data.
 *   price_type:
 *     type: string
 *     description: The shipping option's price type.
 *     enum:
 *       - flat
 *       - calculated
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The shipping option's provider id.
 *   type:
 *     $ref: "#/components/schemas/AdminCreateShippingOption"
 *   prices:
 *     type: array
 *     description: The shipping option's prices.
 *     items:
 *       oneOf:
 *         - type: object
 *           description: The price's prices.
 *           x-schemaName: AdminCreateShippingOptionPriceWithCurrency
 *           required:
 *             - currency_code
 *             - amount
 *           properties:
 *             currency_code:
 *               type: string
 *               title: currency_code
 *               description: The price's currency code.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The price's amount.
 *         - type: object
 *           description: The price's prices.
 *           x-schemaName: AdminCreateShippingOptionPriceWithRegion
 *           required:
 *             - region_id
 *             - amount
 *           properties:
 *             region_id:
 *               type: string
 *               title: region_id
 *               description: The price's region id.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The price's amount.
 *   rules:
 *     type: array
 *     description: The shipping option's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateShippingOptionRule"
 * 
*/

