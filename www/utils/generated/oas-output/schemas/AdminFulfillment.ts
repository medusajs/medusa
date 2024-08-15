/**
 * @schema AdminFulfillment
 * type: object
 * description: The fulfillment's details.
 * x-schemaName: AdminFulfillment
 * required:
 *   - id
 *   - location_id
 *   - provider_id
 *   - shipping_option_id
 *   - provider
 *   - delivery_address
 *   - items
 *   - labels
 *   - packed_at
 *   - shipped_at
 *   - delivered_at
 *   - canceled_at
 *   - data
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The fulfillment's ID.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The fulfillment's location id.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The fulfillment's provider id.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The fulfillment's shipping option id.
 *   provider:
 *     $ref: "#/components/schemas/AdminFulfillmentProvider"
 *   delivery_address:
 *     $ref: "#/components/schemas/AdminFulfillmentAddress"
 *   items:
 *     type: array
 *     description: The fulfillment's items.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentItem"
 *   labels:
 *     type: array
 *     description: The fulfillment's labels.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentLabel"
 *   packed_at:
 *     type: string
 *     title: packed_at
 *     description: The fulfillment's packed at.
 *   shipped_at:
 *     type: string
 *     title: shipped_at
 *     description: The fulfillment's shipped at.
 *   delivered_at:
 *     type: string
 *     title: delivered_at
 *     description: The fulfillment's delivered at.
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The fulfillment's canceled at.
 *   data:
 *     type: object
 *     description: The fulfillment's data.
 *   metadata:
 *     type: object
 *     description: The fulfillment's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The fulfillment's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The fulfillment's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The fulfillment's deleted at.
 * 
*/

