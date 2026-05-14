/**
 * @schema AdminTransaction
 * type: object
 * description: The transaction's details.
 * x-schemaName: AdminTransaction
 * required:
 *   - account
 *   - id
 *   - account_id
 *   - type
 *   - amount
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The transaction's ID.
 *   account_id:
 *     type: string
 *     title: account_id
 *     description: The ID of the store credit account that the transaction belongs to.
 *   type:
 *     type: string
 *     description: The transaction's type.
 *     enum:
 *       - credit
 *       - debit
 *   amount:
 *     type: number
 *     title: amount
 *     description: The transaction's amount.
 *   account:
 *     $ref: "#/components/schemas/AdminStoreCreditAccount"
 *   note:
 *     type: string
 *     title: note
 *     description: The transaction's note.
 *   reference:
 *     type: string
 *     title: reference
 *     description: The transaction's reference.
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The transaction's reference ID.
 *   metadata:
 *     type: object
 *     description: The transaction's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the transaction was created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the transaction was updated at.
 * 
*/

