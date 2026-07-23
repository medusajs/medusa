/**
 * @schema AdminCreateShippingOptionRule
 * type: object
 * description: The details of the shipping option rule.
 * x-schemaName: AdminCreateShippingOptionRule
 * required:
 *   - operator
 *   - attribute
 *   - value
 * properties:
 *   operator:
 *     type: string
 *     description: The operator used to check whether a rule applies.
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
 *     description: The name of a property or table that the rule applies to.
 *     example: customer_group
 *   value:
 *     oneOf:
 *       - type: string
 *         title: value
 *         description: A value of the attribute that enables this rule.
 *         example: cusgroup_123
 *       - type: array
 *         description: Values of the attribute that enable this rule.
 *         items:
 *           type: string
 *           title: value
 *           description: A value of the attribute that enables this rule.
 *           example: cusgroup_123
 * 
*/

