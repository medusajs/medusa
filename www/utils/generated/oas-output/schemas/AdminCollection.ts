/**
 * @schema AdminCollection
 * type: object
 * description: The product collection's details.
 * x-schemaName: AdminCollection
 * required:
 *   - id
 *   - title
 *   - handle
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - metadata
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The collection's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The collection's title.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The collection's handle.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The collection's creation date.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The collection's update date.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The collection's deletion date.
 *   products:
 *     type: array
 *     description: The collection's products.
 *     items:
 *       $ref: "#/components/schemas/BaseProduct"
 *   metadata:
 *     type: object
 *     description: The collection's metadata, used to store custom key-value pairs.
 * 
*/

