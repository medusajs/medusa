/**
 * @schema AdminSalesChannel
 * type: object
 * description: The sales channel's details.
 * x-schemaName: AdminSalesChannel
 * required:
 *   - id
 *   - name
 *   - description
 *   - is_disabled
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The sales channel's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The sales channel's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The sales channel's description.
 *   is_disabled:
 *     type: boolean
 *     title: is_disabled
 *     description: Whether the sales channel is disabled.
 *   metadata:
 *     type: object
 *     description: The sales channel's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the sales channel was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the sales channel was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the sales channel was deleted.
 * 
*/

