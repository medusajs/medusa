/**
 * @schema AdminOrderFilters
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminOrderFilters
 * properties:
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The return's ID.
 *       - type: array
 *         description: The return's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   name:
 *     oneOf:
 *       - type: string
 *         title: name
 *         description: The return's name.
 *       - type: array
 *         description: The return's name.
 *         items:
 *           type: string
 *           title: name
 *           description: The name's details.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The return's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The return's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The return's order.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The return's fields.
 *   $and:
 *     type: array
 *     description: The return's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The return's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

