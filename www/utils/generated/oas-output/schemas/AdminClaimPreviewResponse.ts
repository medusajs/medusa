/**
 * @schema AdminClaimPreviewResponse
 * type: object
 * description: The details of the claim, as well as a preview of the order when the claim is applied.
 * x-schemaName: AdminClaimPreviewResponse
 * required:
 *   - order_preview
 *   - claim
 * properties:
 *   order_preview:
 *     $ref: "#/components/schemas/AdminOrderPreview"
 *   claim:
 *     $ref: "#/components/schemas/AdminClaim"
 * 
*/

