/**
 * @schema AdminRuleAttributeOption
 * type: object
 * description: The attribute's attributes.
 * x-schemaName: AdminRuleAttributeOption
 * required:
 *   - id
 *   - value
 *   - label
 *   - field_type
 *   - required
 *   - disguised
 *   - operators
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The attribute's ID.
 *   value:
 *     type: string
 *     title: value
 *     description: The attribute's value.
 *   label:
 *     type: string
 *     title: label
 *     description: The attribute's label.
 *   field_type:
 *     type: string
 *     title: field_type
 *     description: The attribute's field type.
 *   required:
 *     type: boolean
 *     title: required
 *     description: The attribute's required.
 *   disguised:
 *     type: boolean
 *     title: disguised
 *     description: The attribute's disguised.
 *   operators:
 *     type: array
 *     description: The attribute's operators.
 *     items:
 *       $ref: "#/components/schemas/BaseRuleOperatorOptions"
 * 
*/

