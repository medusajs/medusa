/**
 * @schema AdminProductVariantDeleteResponse
 * type: object
 * description: The details of the product variant's deletion.
 * x-schemaName: AdminProductVariantDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The product variant's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the product variant was deleted.
 *     default: variant
 *   parent:
 *     $ref: "#/components/schemas/AdminProduct"
 * 
*/

