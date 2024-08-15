/**
 * @schema AdminReturnReasonListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminReturnReasonListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - return_reasons
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The return reason's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The return reason's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The return reason's count.
 *   return_reasons:
 *     type: array
 *     description: The return reason's return reasons.
 *     items:
 *       $ref: "#/components/schemas/AdminReturnReason"
 * 
*/

