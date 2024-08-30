/**
 * @schema AdminCurrencyListParams
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCurrencyListParams
 * properties:
 *   q:
 *     type: string
 *     title: q
 *     description: The currency's q.
 *   code:
 *     oneOf:
 *       - type: string
 *         title: code
 *         description: The currency's code.
 *       - type: array
 *         description: The currency's code.
 *         items:
 *           type: string
 *           title: code
 *           description: The code's details.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The currency's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The currency's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The currency's order.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The currency's fields.
 *   $and:
 *     type: array
 *     description: The currency's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The currency's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

