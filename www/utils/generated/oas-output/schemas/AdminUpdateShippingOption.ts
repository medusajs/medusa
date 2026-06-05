/**
 * @schema AdminUpdateShippingOption
 * type: object
 * description: The properties to update in the shipping option type.
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The shipping option's name.
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
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The shipping option's shipping profile id.
 *   type:
 *     $ref: "#/components/schemas/AdminCreateShippingOptionType"
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The shipping option's type id.
 *   prices:
 *     type: array
 *     description: The shipping option's prices.
 *     items:
 *       oneOf:
 *         - $ref: "#/components/schemas/AdminUpdateShippingOptionPriceWithCurrency"
 *         - $ref: "#/components/schemas/AdminUpdateShippingOptionPriceWithRegion"
 *   rules:
 *     type: array
 *     description: The shipping option's rules.
 *     items:
 *       oneOf:
 *         - $ref: "#/components/schemas/AdminCreateShippingOptionRule"
 *         - $ref: "#/components/schemas/AdminUpdateShippingOptionRule"
 *   metadata:
 *     type: object
 *     description: The shipping option's metadata.
 * x-schemaName: AdminUpdateShippingOption
 * 
*/

