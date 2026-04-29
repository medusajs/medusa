/**
 * @schema AdminCreateFlatRateShippingOption
 * type: object
 * description: The flat rate shipping option's details.
 * x-schemaName: AdminCreateFlatRateShippingOption
 * required:
 *   - price_type
 *   - prices
 *   - name
 *   - service_zone_id
 *   - shipping_profile_id
 *   - provider_id
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The flat-rate shipping option's name.
 *   service_zone_id:
 *     type: string
 *     title: service_zone_id
 *     description: The ID of the associated service zone.
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The ID of the associated shipping profile.
 *   data:
 *     type: object
 *     description: The flat-rate shipping option's data, useful for the fulfillment provider handling its processing.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option#data-property
 *   price_type:
 *     type: string
 *     description: The shipping option's price type. If `flat`, the shipping option has a fixed price set in `prices`. Otherwise, the shipping option's price is calculated by the fulfillment provider.
 *     enum:
 *       - flat
 *       - calculated
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the fulfillment provider handling this shipping option.
 *   type:
 *     $ref: "#/components/schemas/AdminCreateShippingOptionType"
 *   prices:
 *     type: array
 *     description: The shipping option's prices.
 *     items:
 *       oneOf:
 *         - type: object
 *           description: The price's details.
 *           x-schemaName: AdminCreateShippingOptionPriceWithCurrency
 *           required:
 *             - currency_code
 *             - amount
 *           properties:
 *             currency_code:
 *               type: string
 *               title: currency_code
 *               description: The price's currency code.
 *               example: usd
 *             amount:
 *               type: number
 *               title: amount
 *               description: The price's amount.
 *             rules:
 *               type: array
 *               description: The price's rules.
 *               items:
 *                 type: object
 *                 description: The rule's details.
 *                 x-schemaName: PriceRule
 *                 required:
 *                   - attribute
 *                   - operator
 *                   - value
 *                 properties:
 *                   attribute:
 *                     type: string
 *                     title: attribute
 *                     description: The rule's attribute.
 *                   operator:
 *                     type: string
 *                     description: The rule's operator.
 *                     enum:
 *                       - gt
 *                       - lt
 *                       - eq
 *                       - lte
 *                       - gte
 *                   value:
 *                     type: number
 *                     title: value
 *                     description: The rule's value.
 *         - type: object
 *           description: The price's details.
 *           x-schemaName: AdminCreateShippingOptionPriceWithRegion
 *           required:
 *             - region_id
 *             - amount
 *           properties:
 *             region_id:
 *               type: string
 *               title: region_id
 *               description: The ID of the region this price is used in.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The price's amount.
 *             rules:
 *               type: array
 *               description: The price's rules.
 *               items:
 *                 type: object
 *                 description: The rule's details.
 *                 x-schemaName: PriceRule
 *                 required:
 *                   - attribute
 *                   - operator
 *                   - value
 *                 properties:
 *                   attribute:
 *                     type: string
 *                     title: attribute
 *                     description: The rule's attribute.
 *                   operator:
 *                     type: string
 *                     description: The rule's operator.
 *                     enum:
 *                       - gt
 *                       - lt
 *                       - eq
 *                       - lte
 *                       - gte
 *                   value:
 *                     type: number
 *                     title: value
 *                     description: The rule's value.
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The ID of the shipping option type that this shipping option belongs to.
 *   rules:
 *     type: array
 *     description: The shipping option's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateShippingOptionRule"
 *   metadata:
 *     type: object
 *     description: The shipping option's metadata.
 * 
*/

