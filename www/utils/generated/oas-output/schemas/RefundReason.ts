/**
 * @schema RefundReason
 * type: object
 * description: The refund reason's details.
 * x-schemaName: RefundReason
 * required:
 *   - id
 *   - label
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The refund reason's ID.
 *   label:
 *     type: string
 *     title: label
 *     description: The refund reason's label.
 *   description:
 *     type: string
 *     title: description
 *     description: The refund reason's description.
 *   metadata:
 *     type: object
 *     description: The refund reason's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the refund reason was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the refund reason was updated.
 * 
*/

