/**
 * @schema BaseOrderFulfillment
 * type: object
 * description: The fulfillment's fulfillments.
 * x-schemaName: BaseOrderFulfillment
 * required:
 *   - id
 *   - location_id
 *   - packed_at
 *   - shipped_at
 *   - delivered_at
 *   - canceled_at
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
 *     description: The fulfillment's location id.
 *   packed_at:
 *     type: string
 *     title: packed_at
 *     description: The fulfillment's packed at.
 *     format: date-time
 *   shipped_at:
 *     type: string
 *     title: shipped_at
 *     description: The fulfillment's shipped at.
 *     format: date-time
 *   delivered_at:
 *     type: string
 *     title: delivered_at
 *     description: The fulfillment's delivered at.
 *     format: date-time
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The fulfillment's canceled at.
 *     format: date-time
 *   data:
 *     type: object
 *     description: The fulfillment's data.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The fulfillment's provider id.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The fulfillment's shipping option id.
 *   metadata:
 *     type: object
 *     description: The fulfillment's metadata.
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The fulfillment's created at.
 *     format: date-time
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The fulfillment's updated at.
 *     format: date-time
 * 
*/

