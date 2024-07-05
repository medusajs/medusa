/**
 * @schema AdminPostStockLocationsReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostStockLocationsReq
 * required:
 *   - name
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The stock location's name.
 *   address:
 *     $ref: "#/components/schemas/StockLocationAddress"
 *   address_id:
 *     type: string
 *     title: address_id
 *     description: The stock location's address id.
 *   metadata:
 *     type: object
 *     description: The stock location's metadata.
 *     properties: {}
 * 
*/

