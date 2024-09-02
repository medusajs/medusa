/**
 * @schema AdminCreateStockLocation
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCreateStockLocation
 * required:
 *   - name
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The stock location's name.
 *   address_id:
 *     type: string
 *     title: address_id
 *     description: The stock location's address id.
 *   address:
 *     $ref: "#/components/schemas/AdminUpsertStockLocationAddress"
 *   metadata:
 *     type: object
 *     description: The stock location's metadata.
 * 
*/

