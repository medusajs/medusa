/**
 * @schema AdminBatchProductVariantResponse
 * type: object
 * description: The details of the product variants created, updated, or deleted.
 * x-schemaName: AdminBatchProductVariantResponse
 * required:
 *   - created
 *   - updated
 *   - deleted
 * properties:
 *   created:
 *     type: array
 *     description: The created product variants.
 *     items:
 *       $ref: "#/components/schemas/AdminProductVariant"
 *   updated:
 *     type: array
 *     description: The updated product variants.
 *     items:
 *       $ref: "#/components/schemas/AdminProductVariant"
 *   deleted:
 *     type: object
 *     description: The details of the deleted product variants.
 *     required:
 *       - ids
 *       - object
 *       - deleted
 *     properties:
 *       ids:
 *         type: array
 *         description: The IDs of the deleted product variants.
 *         items:
 *           type: string
 *           title: ids
 *           description: The ID of a deleted variant.
 *       object:
 *         type: string
 *         title: object
 *         description: The name of the deleted objects.
 *         default: variant
 *       deleted:
 *         type: boolean
 *         title: deleted
 *         description: Whether the product variants were deleted.
 * 
*/

