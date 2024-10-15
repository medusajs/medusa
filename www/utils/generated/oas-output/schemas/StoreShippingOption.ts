/**
 * @schema StoreShippingOption
 * type: object
 * description: The shipping option's details.
 * x-schemaName: StoreShippingOption
 * required:
 *   - id
 *   - name
 *   - price_type
 *   - service_zone_id
 *   - provider_id
 *   - provider
 *   - shipping_option_type_id
 *   - type
 *   - shipping_profile_id
 *   - amount
 *   - is_tax_inclusive
 *   - data
 *   - metadata
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The shipping option's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The shipping option's name.
 *   price_type:
 *     type: string
 *     description: The shipping option's price type. If it's `flat`, the price is fixed and is set in the `prices` property. If it's `calculated`, the price is calculated on checkout by the associated
 *       fulfillment provider.
 *     enum:
 *       - flat
 *       - calculated
 *   service_zone_id:
 *     type: string
 *     title: service_zone_id
 *     description: The ID of the service zone the shipping option belongs to.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the fulfillment provider handling this option.
 *   provider:
 *     $ref: "#/components/schemas/BaseFulfillmentProvider"
 *   shipping_option_type_id:
 *     type: string
 *     title: shipping_option_type_id
 *     description: The ID of the shipping option's type.
 *   type:
 *     $ref: "#/components/schemas/StoreShippingOptionType"
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The ID of the associated shipping profile.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The shipping option's amount.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether the amount includes taxes.
 *   data:
 *     type: object
 *     description: The shipping option's data, useful for the provider handling fulfillment.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property
 *   metadata:
 *     type: object
 *     description: The shipping option's metadata, can hold custom key-value pairs.
 * 
*/

