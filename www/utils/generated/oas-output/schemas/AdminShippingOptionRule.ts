/**
 * @schema AdminShippingOptionRule
 * type: object
 * description: The updated's details.
 * x-schemaName: AdminShippingOptionRule
 * required:
 *   - id
 *   - attribute
 *   - operator
 *   - value
 *   - shipping_option_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The updated's ID.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The updated's attribute.
 *   operator:
 *     type: string
 *     title: operator
 *     description: The updated's operator.
 *   value:
 *     oneOf:
 *       - type: string
 *         title: value
 *         description: The updated's value.
 *       - type: array
 *         description: The updated's value.
 *         items:
 *           type: string
 *           title: value
 *           description: The value's details.
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The updated's shipping option id.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The updated's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The updated's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The updated's deleted at.
 * 
*/

