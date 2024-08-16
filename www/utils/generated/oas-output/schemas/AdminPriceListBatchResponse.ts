/**
 * @schema AdminPriceListBatchResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPriceListBatchResponse
 * required:
 *   - created
 *   - updated
 *   - deleted
 * properties:
 *   created:
 *     type: array
 *     description: The price list's created.
 *     items:
 *       $ref: "#/components/schemas/AdminPrice"
 *   updated:
 *     type: array
 *     description: The price list's updated.
 *     items:
 *       $ref: "#/components/schemas/AdminPrice"
 *   deleted:
 *     type: object
 *     description: The price list's deleted.
 *     required:
 *       - ids
 *       - object
 *       - deleted
 *     properties:
 *       ids:
 *         type: array
 *         description: The deleted's ids.
 *         items:
 *           type: string
 *           title: ids
 *           description: The id's ids.
 *       object:
 *         type: string
 *         title: object
 *         description: The deleted's object.
 *       deleted:
 *         type: boolean
 *         title: deleted
 *         description: The deleted's details.
 * 
*/

