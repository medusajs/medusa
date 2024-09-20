/**
 * @schema AdminReturnPreviewResponse
 * type: object
 * description: The details of a return and a preview of the order once the return is applied.
 * x-schemaName: AdminReturnPreviewResponse
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

