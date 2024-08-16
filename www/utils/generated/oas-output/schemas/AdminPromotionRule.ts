/**
 * @schema AdminPromotionRule
 * type: object
 * description: The updated's details.
 * x-schemaName: AdminPromotionRule
 * required:
 *   - id
 *   - values
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The updated's ID.
 *   description:
 *     type: string
 *     title: description
 *     description: The updated's description.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The updated's attribute.
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
 *     description: The updated's values.
 *     items:
 *       $ref: "#/components/schemas/BasePromotionRuleValue"
 * 
*/

