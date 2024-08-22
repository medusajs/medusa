/**
 * @schema AdminTaxRate
 * type: object
 * description: The tax rate's details.
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
 *     description: The tax rate's ID.
 *   rate:
 *     type: number
 *     title: rate
 *     description: The tax rate's rate.
 *   code:
 *     type: string
 *     title: code
 *     description: The tax rate's code.
 *   name:
 *     type: string
 *     title: name
 *     description: The tax rate's name.
 *   metadata:
 *     type: object
 *     description: The tax rate's metadata.
 *   tax_region_id:
 *     type: string
 *     title: tax_region_id
 *     description: The tax rate's tax region id.
 *   is_combinable:
 *     type: boolean
 *     title: is_combinable
 *     description: The tax rate's is combinable.
 *   is_default:
 *     type: boolean
 *     title: is_default
 *     description: The tax rate's is default.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The tax rate's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The tax rate's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The tax rate's deleted at.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The tax rate's created by.
 *   tax_region:
 *     $ref: "#/components/schemas/AdminTaxRegion"
 *   rules:
 *     type: array
 *     description: The tax rate's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminTaxRateRule"
 * 
*/

