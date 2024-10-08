/**
 * @schema AdminClaimReturnPreviewResponse
 * type: object
 * description: The details of the claim's return, with a preview of the order when the claim's return is applied.
 * x-schemaName: AdminClaimReturnPreviewResponse
 * required:
 *   - order_preview
 *   - return
 * properties:
 *   order_preview:
 *     $ref: "#/components/schemas/AdminOrderPreview"
 *   return:
 *     $ref: "#/components/schemas/AdminReturn"
 * 
*/

