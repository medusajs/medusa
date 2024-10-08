/**
 * @schema AdminClaimRequestResponse
 * type: object
 * description: The details of the claim, its return, and a preview of the order when the claim is applied.
 * x-schemaName: AdminClaimRequestResponse
 * required:
 *   - return
 *   - order_preview
 *   - claim
 * properties:
 *   return:
 *     $ref: "#/components/schemas/AdminReturn"
 *   order_preview:
 *     $ref: "#/components/schemas/AdminOrderPreview"
 *   claim:
 *     $ref: "#/components/schemas/AdminClaim"
 * 
*/

