/**
 * @schema AdminCustomerListResponse
 * type: object
 * required:
 *   - customers
 *   - limit
 *   - offset
 *   - count
 * x-schemaName: AdminCustomerListResponse
 * properties:
 *   customers:
 *     type: array
 *     description: The customer's customers.
 *     items:
 *       $ref: "#/components/schemas/CustomerResponse"
 *   limit:
 *     type: number
 *     title: limit
 *     description: The customer's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The customer's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The customer's count.
 * 
*/

