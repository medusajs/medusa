/**
 * @schema AdminPromotionRule
 * type: object
 * description: The promotion rule's details.
 * x-schemaName: AdminPromotionRule
 * required:
 *   - id
 *   - values
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The promotion rule's ID.
 *   description:
 *     type: string
 *     title: description
 *     description: The promotion rule's description.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The promotion rule's attribute.
 *     example: customer_group_id
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
 *   values:
 *     type: array
 *     description: The rule's values.
 *     example:
 *       - cusgroup_123
 *     items:
 *       $ref: "#/components/schemas/BasePromotionRuleValue"
 * 
*/

