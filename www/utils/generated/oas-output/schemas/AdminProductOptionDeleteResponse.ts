/**
 * @schema AdminProductOptionDeleteResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminProductOptionDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The product's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the Product was deleted.
 *   parent:
 *     $ref: "#/components/schemas/AdminProduct"
 * 
*/

