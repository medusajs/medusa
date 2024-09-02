/**
 * @schema AdminPricePreferenceListParams
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPricePreferenceListParams
 * properties:
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The price preference's ID.
 *       - type: array
 *         description: The price preference's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   attribute:
 *     oneOf:
 *       - type: string
 *         title: attribute
 *         description: The price preference's attribute.
 *       - type: array
 *         description: The price preference's attribute.
 *         items:
 *           type: string
 *           title: attribute
 *           description: The attribute's details.
 *   value:
 *     oneOf:
 *       - type: string
 *         title: value
 *         description: The price preference's value.
 *       - type: array
 *         description: The price preference's value.
 *         items:
 *           type: string
 *           title: value
 *           description: The value's details.
 *   q:
 *     type: string
 *     title: q
 *     description: The price preference's q.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The price preference's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The price preference's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The price preference's order.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The price preference's fields.
 *   $and:
 *     type: array
 *     description: The price preference's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The price preference's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

