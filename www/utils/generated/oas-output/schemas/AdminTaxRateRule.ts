/**
 * @schema AdminTaxRateRule
 * type: object
 * description: The tax rate rule's details.
 * x-schemaName: AdminTaxRateRule
 * required:
 *   - reference
 *   - reference_id
 *   - created_at
 * properties:
 *   reference:
 *     type: string
 *     title: reference
 *     description: The name of the table this rule references.
 *     example: product_type
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The ID of a record in the table that this rule references.
 *     example: ptyp_1
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the tax rate rule was created.
 * 
*/

