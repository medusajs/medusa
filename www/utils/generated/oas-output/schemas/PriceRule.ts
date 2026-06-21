/**
 * @schema PriceRule
 * type: object
 * description: The price rule's details.
 * x-schemaName: PriceRule
 * required:
 *   - attribute
 *   - operator
 *   - value
 * properties:
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The rule's attribute.
 *   operator:
 *     type: string
 *     title: operator
 *     description: The rule's operator.
 *     enum:
 *       - gt
 *       - lt
 *       - eq
 *       - lte
 *       - gte
 *   value:
 *     type: number
 *     title: value
 *     description: The rule's value.
 * 
*/

