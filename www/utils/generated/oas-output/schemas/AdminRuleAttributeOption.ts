/**
 * @schema AdminRuleAttributeOption
 * type: object
 * description: The details of a potential rule attribute.
 * x-schemaName: AdminRuleAttributeOption
 * required:
 *   - id
 *   - value
 *   - label
 *   - operators
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The rule attribute's ID, which is a rule's `attribute` it refers to.
 *     example: customer_group
 *   value:
 *     type: string
 *     title: value
 *     description: The rule attribute's value.
 *     example: customer.groups.id
 *   label:
 *     type: string
 *     title: label
 *     description: The rule attribute option's label.
 *     example: Customer Group
 *   operators:
 *     type: array
 *     description: The attribute's operators.
 *     items:
 *       $ref: "#/components/schemas/BaseRuleOperatorOptions"
 * 
*/

