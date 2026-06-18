/**
 * @schema AdminInvite
 * type: object
 * description: The invite's details.
 * x-schemaName: AdminInvite
 * required:
 *   - id
 *   - email
 *   - accepted
 *   - token
 *   - expires_at
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The invite's ID.
 *   email:
 *     type: string
 *     title: email
 *     description: The invite's email.
 *     format: email
 *   accepted:
 *     type: boolean
 *     title: accepted
 *     description: Whether the invite has been accepted.
 *   token:
 *     type: string
 *     title: token
 *     description: The invite's token.
 *   expires_at:
 *     type: string
 *     title: expires_at
 *     description: The invite's expiry date.
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: The invite's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the invite was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the invite was updated.
 * 
*/

