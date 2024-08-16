/**
 * @schema AdminStockLocation
 * type: object
 * description: The fulfillment set's location.
 * x-schemaName: AdminStockLocation
 * required:
 *   - id
 *   - name
 *   - address_id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The location's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The location's name.
 *   address_id:
 *     type: string
 *     title: address_id
 *     description: The location's address id.
 *   address:
 *     $ref: "#/components/schemas/AdminStockLocationAddress"
 *   sales_channels:
 *     type: array
 *     description: The location's sales channels.
 *     items:
 *       $ref: "#/components/schemas/AdminSalesChannel"
 *   fulfillment_providers:
 *     type: array
 *     description: The location's fulfillment providers.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentProvider"
 *   fulfillment_sets:
 *     type: array
 *     description: The location's fulfillment sets.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentSet"
 * 
*/

