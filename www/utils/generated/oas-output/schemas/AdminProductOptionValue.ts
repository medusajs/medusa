/**
 * @schema AdminProductOptionValue
 * type: object
 * description: The product option value's details.
 * x-schemaName: AdminProductOptionValue
 * required:
 *   - id
 *   - value
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The value's ID.
 *   value:
 *     type: string
 *     title: value
 *     description: The value.
 *   option:
 *     $ref: "#/components/schemas/AdminProductOption"
 *   option_id:
 *     type: string
 *     title: option_id
 *     description: The ID of the option this value belongs to.
 *   metadata:
 *     type: object
 *     description: The value's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the value was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the value was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the value was deleted.
 * 
*/

