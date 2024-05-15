/**
 * @schema AdminShippingOptionListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminShippingOptionListResponse
 * required:
 *   - shipping_options
 *   - limit
 *   - offset
 *   - count
 * properties:
 *   shipping_options:
 *     type: array
 *     description: The shipping option's shipping options.
 *     items:
 *       $ref: "#/components/schemas/AdminShippingOptionResponse"
 *   limit:
 *     type: number
 *     title: limit
 *     description: The shipping option's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The shipping option's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The shipping option's count.
 * 
*/

