/**
 * @schema AdminProductOption
 * type: object
 * description: The product option's details.
 * x-schemaName: AdminProductOption
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The option's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The option's title.
 *   product:
 *     $ref: "#/components/schemas/AdminProduct"
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The option's product id.
 *   values:
 *     type: array
 *     description: The option's values.
 *     items:
 *       $ref: "#/components/schemas/AdminProductOptionValue"
 *   metadata:
 *     type: object
 *     description: The option's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The option's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The option's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The option's deleted at.
 * required:
 *   - id
 *   - title
 * 
*/

