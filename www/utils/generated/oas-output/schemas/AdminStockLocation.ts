/**
 * @schema AdminStockLocation
 * type: object
 * description: The stock location's details.
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
 *     description: The ID of the associated address.
 *   address:
 *     $ref: "#/components/schemas/AdminStockLocationAddress"
 *   sales_channels:
 *     type: array
 *     description: The sales channels associated with the location.
 *     items:
 *       $ref: "#/components/schemas/AdminSalesChannel"
 *   fulfillment_providers:
 *     type: array
 *     description: The fulfillment providers associated with the location.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentProvider"
 *   fulfillment_sets:
 *     type: array
 *     description: The fulfillment sets associated with the location.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentSet"
 * 
*/

