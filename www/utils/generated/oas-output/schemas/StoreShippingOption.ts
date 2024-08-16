/**
 * @schema StoreShippingOption
 * type: object
 * description: The shipping option's shipping options.
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
 *     enum:
 *       - flat
 *       - calculated
 *   service_zone_id:
 *     type: string
 *     title: service_zone_id
 *     description: The shipping option's service zone id.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The shipping option's provider id.
 *   provider:
 *     $ref: "#/components/schemas/BaseFulfillmentProvider"
 *   shipping_option_type_id:
 *     type: string
 *     title: shipping_option_type_id
 *     description: The shipping option's shipping option type id.
 *   type:
 *     $ref: "#/components/schemas/StoreShippingOption"
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The shipping option's shipping profile id.
 *   amount:
 *     type: number
 *     title: amount
 *     description: The shipping option's amount.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: The shipping option's is tax inclusive.
 *   data:
 *     type: object
 *     description: The shipping option's data.
 *   metadata:
 *     type: object
 *     description: The shipping option's metadata.
 * 
*/

