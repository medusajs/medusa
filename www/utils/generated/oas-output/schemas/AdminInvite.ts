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
 *     description: The invite's accepted.
 *   token:
 *     type: string
 *     title: token
 *     description: The invite's token.
 *   expires_at:
 *     type: string
 *     title: expires_at
 *     description: The invite's expires at.
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: The invite's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The invite's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The invite's updated at.
 * 
*/

