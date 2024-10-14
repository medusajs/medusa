/**
 * @schema AdminProductOptionDeleteResponse
 * type: object
 * description: The details of the product option deletion.
 * x-schemaName: AdminProductOptionDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The product option's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: product_option
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the product option was deleted.
 *   parent:
 *     $ref: "#/components/schemas/AdminProduct"
 * 
*/

