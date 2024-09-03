/**
 * @schema AdminTaxRate
 * type: object
 * description: The tax rate's parent.
 * x-schemaName: AdminTaxRate
 * required:
 *   - id
 *   - rate
 *   - code
 *   - name
 *   - metadata
 *   - tax_region_id
 *   - is_combinable
 *   - is_default
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - created_by
 *   - tax_region
 *   - rules
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The parent's ID.
 *   rate:
 *     type: number
 *     title: rate
 *     description: The parent's rate.
 *   code:
 *     type: string
 *     title: code
 *     description: The parent's code.
 *   name:
 *     type: string
 *     title: name
 *     description: The parent's name.
 *   metadata:
 *     type: object
 *     description: The parent's metadata.
 *   tax_region_id:
 *     type: string
 *     title: tax_region_id
 *     description: The parent's tax region id.
 *   is_combinable:
 *     type: boolean
 *     title: is_combinable
 *     description: The parent's is combinable.
 *   is_default:
 *     type: boolean
 *     title: is_default
 *     description: The parent's is default.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The parent's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The parent's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The parent's deleted at.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The parent's created by.
 *   tax_region:
 *     $ref: "#/components/schemas/AdminTaxRegion"
 *   rules:
 *     type: array
 *     description: The parent's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminTaxRateRule"
 * 
*/

