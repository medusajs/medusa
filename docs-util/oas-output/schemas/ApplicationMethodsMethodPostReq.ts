/**
 * @schema ApplicationMethodsMethodPostReq
 * type: object
 * description: The promotion's application method.
 * x-schemaName: ApplicationMethodsMethodPostReq
 * properties:
 *   description:
 *     type: string
 *     title: description
 *     description: The application method's description.
 *   value:
 *     type: string
 *     title: value
 *     description: The application method's value.
 *   max_quantity:
 *     type: number
 *     title: max_quantity
 *     description: The application method's max quantity.
 *   type:
 *     type: string
 *     enum:
 *       - fixed
 *       - percentage
 *   target_type:
 *     type: string
 *     enum:
 *       - order
 *       - shipping_methods
 *       - items
 *   allocation:
 *     type: string
 *     enum:
 *       - each
 *       - across
 *   target_rules:
 *     type: array
 *     description: The application method's target rules.
 *     items:
 *       type: object
 *       description: The target rule's target rules.
 *       x-schemaName: PromotionRule
 *       required:
 *         - operator
 *         - attribute
 *         - values
 *       properties:
 *         operator:
 *           type: string
 *           enum:
 *             - gte
 *             - lte
 *             - gt
 *             - lt
 *             - eq
 *             - ne
 *             - in
 *         description:
 *           type: string
 *           title: description
 *           description: The target rule's description.
 *         attribute:
 *           type: string
 *           title: attribute
 *           description: The target rule's attribute.
 *         values:
 *           type: array
 *           description: The target rule's values.
 *           items:
 *             type: string
 *             title: values
 *             description: The value's values.
 *   buy_rules:
 *     type: array
 *     description: The application method's buy rules.
 *     items:
 *       type: object
 *       description: The buy rule's buy rules.
 *       x-schemaName: PromotionRule
 *       required:
 *         - operator
 *         - attribute
 *         - values
 *       properties:
 *         operator:
 *           type: string
 *           enum:
 *             - gte
 *             - lte
 *             - gt
 *             - lt
 *             - eq
 *             - ne
 *             - in
 *         description:
 *           type: string
 *           title: description
 *           description: The buy rule's description.
 *         attribute:
 *           type: string
 *           title: attribute
 *           description: The buy rule's attribute.
 *         values:
 *           type: array
 *           description: The buy rule's values.
 *           items:
 *             type: string
 *             title: values
 *             description: The value's values.
 *   apply_to_quantity:
 *     type: number
 *     title: apply_to_quantity
 *     description: The application method's apply to quantity.
 *   buy_rules_min_quantity:
 *     type: number
 *     title: buy_rules_min_quantity
 *     description: The application method's buy rules min quantity.
 * 
*/

