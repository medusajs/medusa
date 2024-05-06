/**
 * @schema AdminShippingOptionRuleResponse
 * type: object
 * description: The rule's rules.
 * x-schemaName: AdminShippingOptionRuleResponse
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
 *     description: The rule's ID.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The rule's attribute.
 *   operator:
 *     type: string
 *     title: operator
 *     description: The rule's operator.
 *   value:
 *     type: object
 *     description: The rule's value.
 *     properties: {}
 *   shipping_option_id:
 *     type: string
 *     title: shipping_option_id
 *     description: The rule's shipping option id.
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The rule's created at.
 *     format: date-time
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The rule's updated at.
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     title: deleted_at
 *     description: The rule's deleted at.
 *     format: date-time
 * 
*/

