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
 *   values:
 *     type: array
 *     description: The option's values.
 *     items:
 *       $ref: "#/components/schemas/StoreProductOptionValue"
 *   metadata:
 *     type: object
 *     description: The option's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/store#manage-metadata
 *       description: Learn how to manage metadata
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
 *   products:
 *     type: array
 *     description: The products that use the option.
 *     items:
 *       $ref: "#/components/schemas/BaseProduct"
 *   is_exclusive:
 *     type: boolean
 *     title: is_exclusive
 *     description: Whether the option is exclusive to a product.
 * required:
 *   - title
 *   - id
 *   - is_exclusive
 * 
*/

