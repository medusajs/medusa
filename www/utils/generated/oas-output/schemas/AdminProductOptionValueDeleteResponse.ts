/**
 * @schema AdminProductOptionValueDeleteResponse
 * type: object
 * description: The details of the product option value deletion.
 * x-schemaName: AdminProductOptionValueDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The ID of the deleted product option value.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: product_option_value
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the Product Option Value was deleted.
 *   parent:
 *     $ref: "#/components/schemas/AdminProductOption"
 * 
*/

