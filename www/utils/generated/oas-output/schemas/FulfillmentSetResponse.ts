/**
 * @schema FulfillmentSetResponse
 * type: object
 * description: The fulfillment set's parent.
 * x-schemaName: FulfillmentSetResponse
 * required:
 *   - id
 *   - name
 *   - type
 *   - metadata
 *   - service_zones
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The parent's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The parent's name.
 *   type:
 *     type: string
 *     title: type
 *     description: The parent's type.
 *   metadata:
 *     type: object
 *     description: The parent's metadata.
 *     properties: {}
 *   service_zones:
 *     type: array
 *     description: The parent's service zones.
 *     items:
 *       $ref: "#/components/schemas/ServiceZoneResponse"
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The parent's created at.
 *     format: date-time
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The parent's updated at.
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     title: deleted_at
 *     description: The parent's deleted at.
 *     format: date-time
 * 
*/

