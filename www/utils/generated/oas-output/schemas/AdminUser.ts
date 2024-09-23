/**
 * @schema AdminUser
 * type: object
 * description: The user's details.
 * x-schemaName: AdminUser
 * required:
 *   - id
 *   - email
 *   - first_name
 *   - last_name
 *   - avatar_url
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The user's ID.
 *   email:
 *     type: string
 *     title: email
 *     description: The user's email.
 *     format: email
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The user's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The user's last name.
 *   avatar_url:
 *     type: string
 *     title: avatar_url
 *     description: The URL of the user's avatar.
 *   metadata:
 *     type: object
 *     description: The user's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the user was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the user was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the user was deleted.
 * 
*/

