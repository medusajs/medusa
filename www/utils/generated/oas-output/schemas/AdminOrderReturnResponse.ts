/**
 * @schema AdminOrderReturnResponse
 * type: object
 * description: The order return details.
 * x-schemaName: AdminOrderReturnResponse
 * required:
 *   - order
 *   - return
 * properties:
 *   order:
 *     type: string
 *     title: order
 *     description: The order change's order.
 *     externalDocs:
 *       url: "#pagination"
 *   return:
 *     $ref: "#/components/schemas/AdminReturn"
 * 
*/

