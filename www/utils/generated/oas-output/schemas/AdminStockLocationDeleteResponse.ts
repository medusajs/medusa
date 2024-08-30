/**
 * @schema AdminStockLocationDeleteResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminStockLocationDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The stock location's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: stock_location
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the Stock Location was deleted.
 *   parent:
 *     type: object
 *     description: The stock location's parent.
 * 
*/

