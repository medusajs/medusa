/**
 * @schema AdminPriceListBatchResponse
 * type: object
 * description: The details of the created, updated, and deleted prices in a price list.
 * x-schemaName: AdminPriceListBatchResponse
 * required:
 *   - created
 *   - updated
 *   - deleted
 * properties:
 *   created:
 *     type: array
 *     description: The created prices.
 *     items:
 *       $ref: "#/components/schemas/AdminPrice"
 *   updated:
 *     type: array
 *     description: The updated prices.
 *     items:
 *       $ref: "#/components/schemas/AdminPrice"
 *   deleted:
 *     type: object
 *     description: The details of the deleted prices.
 *     required:
 *       - ids
 *       - object
 *       - deleted
 *     properties:
 *       ids:
 *         type: array
 *         description: The IDs of the deleted prices.
 *         items:
 *           type: string
 *           title: ids
 *           description: A price's ID.
 *       object:
 *         type: string
 *         title: object
 *         description: The name of the deleted object.
 *         default: price
 *       deleted:
 *         type: boolean
 *         title: deleted
 *         description: Whether the prices were deleted.
 * 
*/

