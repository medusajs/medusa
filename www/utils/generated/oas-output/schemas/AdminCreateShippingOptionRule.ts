/**
 * @schema AdminCreateShippingOptionRule
 * type: object
 * description: The rule's rules.
 * required:
 *   - operator
 *   - attribute
 *   - value
 * properties:
 *   operator:
 *     type: string
 *     enum:
 *       - in
 *       - eq
 *       - ne
 *       - gt
 *       - gte
 *       - lt
 *       - lte
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
 * x-schemaName: AdminCreateShippingOptionRule
 * 
*/

