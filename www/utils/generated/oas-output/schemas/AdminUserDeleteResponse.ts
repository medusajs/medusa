/**
 * @schema AdminUserDeleteResponse
 * type: object
 * description: The details of the deleted user.
 * x-schemaName: AdminUserDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The user's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: user
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the user was deleted.
 * 
*/

