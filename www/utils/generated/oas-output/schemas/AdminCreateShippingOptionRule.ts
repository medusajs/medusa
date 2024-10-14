/**
 * @schema AdminCreateShippingOptionRule
 * type: object
 * description: The rule's rules.
 * x-schemaName: AdminCreateShippingOptionRule
 * required:
 *   - operator
 *   - attribute
 *   - value
 * properties:
 *   operator:
 *     type: string
 *     description: The rule's operator.
 *     enum:
 *       - gt
 *       - lt
 *       - eq
 *       - ne
 *       - in
 *       - lte
 *       - gte
 *       - nin
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The rule's attribute.
 *   value:
 *     oneOf:
 *       - type: string
 *         title: value
 *         description: The rule's value.
 *       - type: array
 *         description: The rule's value.
 *         items:
 *           type: string
 *           title: value
 *           description: The value's details.
 * 
*/

