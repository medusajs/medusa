/**
 * @schema AdminExchangeOrderResponse
 * type: object
 * description: The exchange's details.
 * x-schemaName: AdminExchangeOrderResponse
 * required:
 *   - order
 *   - exchange
 * properties:
 *   order:
 *     description: The details of the associated order.
 *     $ref: "#/components/schemas/Order"
 *   exchange:
 *     $ref: "#/components/schemas/AdminExchange"
 * 
*/

