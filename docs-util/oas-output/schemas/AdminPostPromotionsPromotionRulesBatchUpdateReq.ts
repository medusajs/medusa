/**
 * @schema AdminPostPromotionsPromotionRulesBatchUpdateReq
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostPromotionsPromotionRulesBatchUpdateReq
 * required:
 *   - rules
 * properties:
 *   rules:
 *     type: array
 *     description: The promotion's rules.
 *     items:
 *       type: object
 *       description: The rule's rules.
 *       x-schemaName: UpdatePromotionRule
 *       required:
 *         - id
 *         - attribute
 *         - values
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The rule's ID.
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
 *           description: The rule's description.
 *         attribute:
 *           type: string
 *           title: attribute
 *           description: The rule's attribute.
 *         values:
 *           type: array
 *           description: The rule's values.
 *           items:
 *             type: string
 *             title: values
 *             description: The value's values.
 * 
*/

