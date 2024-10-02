/**
 * @schema StoreOrderFulfillment
 * type: object
 * description: The fulfillment's details.
 * x-schemaName: StoreOrderFulfillment
 * required:
 *   - id
 *   - location_id
 *   - packed_at
 *   - shipped_at
 *   - delivered_at
 *   - canceled_at
 *   - requires_shipping
 *   - data
 *   - provider_id
 *   - shipping_option_id
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The fulfillment's ID.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location the items are fulfilled from.
 *   packed_at:
 *     type: string
 *     title: packed_at
 *     description: The date the fulfillment was packed.
 *     format: date-time
 *   shipped_at:
 *     type: string
 *     title: shipped_at
 *     description: The date the fulfillment was shipped.
 *     format: date-time
 *   delivered_at:
 *     type: string
 *     title: delivered_at
 *     description: The date the fulfillment was delivered.
 *     format: date-time
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The date the fulfillment was canceled.
 *     format: date-time
 *   requires_shipping:
 *     type: boolean
 *     title: requires_shipping
 *     description: Whether the fulfillment requires shipping.
 *   data:
 *     type: object
 *     description: The fulfillment's data, useful for the fulfillment providering handling it.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/item-fulfillment#data-property
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the provider handling this fulfillment.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The ID of the associated shipping option.
 *   metadata:
 *     type: object
 *     description: The fulfillment's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the fulfillment was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the fulfillment was updated.
 * 
*/

