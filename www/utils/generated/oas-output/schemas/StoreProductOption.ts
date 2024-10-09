/**
 * @schema StoreProductOption
 * type: object
 * description: The product option's details.
 * x-schemaName: StoreProductOption
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
 *     $ref: "#/components/schemas/StoreProduct"
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The ID of the product this option belongs to.
 *   values:
 *     type: array
 *     description: The option's values.
 *     items:
 *       $ref: "#/components/schemas/StoreProductOptionValue"
 *   metadata:
 *     type: object
 *     description: The option's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the product option was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the product option was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the product option was deleted.
 * required:
 *   - title
 *   - id
 * 
*/

