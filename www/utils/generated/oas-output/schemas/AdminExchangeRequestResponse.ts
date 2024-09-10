/**
 * @schema AdminExchangeRequestResponse
 * type: object
 * description: The details of a requested exchange.
 * x-schemaName: AdminExchangeRequestResponse
 * required:
 *   - return
 *   - order_preview
 *   - exchange
 * properties:
 *   return:
 *     description: The associated return's details.
 *     $ref: "#/components/schemas/AdminReturn"
 *   order_preview:
 *     description: A preview of the order once the exchange is applied.
 *     $ref: "#/components/schemas/OrderPreview"
 *   exchange:
 *     $ref: "#/components/schemas/AdminExchange"
 * 
*/

