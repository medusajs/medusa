/**
 * @schema AdminCreateReturnReason
 * type: object
 * description: The details of the return reason to create.
 * x-schemaName: AdminCreateReturnReason
 * required:
 *   - value
 *   - label
 * properties:
 *   value:
 *     type: string
 *     title: value
 *     description: The return reason's value.
 *   label:
 *     type: string
 *     title: label
 *     description: The return reason's label.
 *   description:
 *     type: string
 *     title: description
 *     description: The return reason's description.
 *   parent_return_reason_id:
 *     type: string
 *     title: parent_return_reason_id
 *     description: The ID of the parent return reason.
 *   metadata:
 *     type: object
 *     description: The return reason's metadata, can hold custom key-value pairs.
 * 
*/

