/**
 * @schema BaseOrderFulfillment
 * type: object
 * description: The fulfillment's details.
 * x-schemaName: BaseOrderFulfillment
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
 *     description: The date the items were packed.
 *     format: date-time
 *   shipped_at:
 *     type: string
 *     title: shipped_at
 *     description: The date the items were shipped.
 *     format: date-time
 *   delivered_at:
 *     type: string
 *     title: delivered_at
 *     description: The date the items were delivered.
 *     format: date-time
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The date the items were canceled.
 *     format: date-time
 *   data:
 *     type: object
 *     description: Data useful for the fulfillment provider handling it. This is taken from the associated shipping option.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The ID of the fulfillment provider used to handle the fulfillment.
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
 *   requires_shipping:
 *     type: boolean
 *     title: requires_shipping
 *     description: Whether the fulfillment requires shipping.
 * 
*/

