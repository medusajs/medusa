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
 *         description: The order's ID.
 *       - type: array
 *         description: The order's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   name:
 *     oneOf:
 *       - type: string
 *         title: name
 *         description: The order's name.
 *       - type: array
 *         description: The order's name.
 *         items:
 *           type: string
 *           title: name
 *           description: The name's details.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The order's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The order's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The order's details.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The order's fields.
 *   $and:
 *     type: array
 *     description: The order's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The order's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

