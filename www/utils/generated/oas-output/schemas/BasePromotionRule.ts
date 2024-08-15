/**
 * @schema BasePromotionRule
 * type: object
 * description: The rule's rules.
 * x-schemaName: BasePromotionRule
 * required:
 *   - id
 *   - values
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The rule's ID.
 *   description:
 *     type: string
 *     title: description
 *     description: The rule's description.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The rule's attribute.
 *   operator:
 *     type: string
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
 *     items:
 *       $ref: "#/components/schemas/BasePromotionRuleValue"
 * 
*/

