/**
 * @schema AdminShippingOptionResponse
 * type: object
 * description: The shipping option's details.
 * x-schemaName: AdminShippingOptionResponse
 * required:
 *   - id
 *   - name
 *   - price_type
 *   - service_zone_id
 *   - shipping_profile_id
 *   - provider_id
 *   - shipping_option_type_id
 *   - data
 *   - metadata
 *   - service_zone
 *   - shipping_profile
 *   - provider
 *   - type
 *   - rules
 *   - prices
 *   - created_at
 *   - updated_at
 *   - deleted_at
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
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The shipping option's shipping profile id.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The shipping option's provider id.
 *   shipping_option_type_id:
 *     type: string
 *     title: shipping_option_type_id
 *     description: The shipping option's shipping option type id.
 *   data:
 *     type: object
 *     description: The shipping option's data.
 *     properties: {}
 *   metadata:
 *     type: object
 *     description: The shipping option's metadata.
 *     properties: {}
 *   service_zone:
 *     $ref: "#/components/schemas/AdminServiceZoneResponse"
 *   shipping_profile:
 *     $ref: "#/components/schemas/AdminShippingProfileResponse"
 *   provider:
 *     $ref: "#/components/schemas/AdminFulfillmentProviderResponse"
 *   type:
 *     $ref: "#/components/schemas/AdminShippingOptionTypeResponse"
 *   rules:
 *     type: array
 *     description: The shipping option's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminShippingOptionRuleResponse"
 *   prices:
 *     type: array
 *     description: The shipping option's prices.
 *     items:
 *       $ref: "#/components/schemas/AdminPriceSetPriceResponse"
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The shipping option's created at.
 *     format: date-time
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The shipping option's updated at.
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     title: deleted_at
 *     description: The shipping option's deleted at.
 *     format: date-time
 * 
*/

