/**
 * @schema AdminFulfillmentLabel
 * type: object
 * description: The details of a fulfillmet's shipment label.
 * x-schemaName: AdminFulfillmentLabel
 * required:
 *   - id
 *   - tracking_number
 *   - tracking_url
 *   - label_url
 *   - fulfillment_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The label's ID.
 *   tracking_number:
 *     type: string
 *     title: tracking_number
 *     description: The label's tracking number.
 *   tracking_url:
 *     type: string
 *     title: tracking_url
 *     description: The label's tracking URL.
 *   label_url:
 *     type: string
 *     title: label_url
 *     description: The label's URL.
 *   fulfillment_id:
 *     type: string
 *     title: fulfillment_id
 *     description: The ID of the fulfillment the label is associated with.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the label was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the label was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the label was deleted.
 * 
*/

