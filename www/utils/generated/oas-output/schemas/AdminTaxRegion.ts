/**
 * @schema AdminTaxRegion
 * type: object
 * description: The tax rate's tax region.
 * x-schemaName: AdminTaxRegion
 * required:
 *   - id
 *   - rate
 *   - code
 *   - country_code
 *   - province_code
 *   - name
 *   - metadata
 *   - tax_region_id
 *   - is_combinable
 *   - is_default
 *   - parent_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - created_by
 *   - tax_rates
 *   - parent
 *   - children
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The tax region's ID.
 *   rate:
 *     type: number
 *     title: rate
 *     description: The tax region's rate.
 *   code:
 *     type: string
 *     title: code
 *     description: The tax region's code.
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The tax region's country code.
 *   province_code:
 *     type: string
 *     title: province_code
 *     description: The tax region's province code.
 *   name:
 *     type: string
 *     title: name
 *     description: The tax region's name.
 *   metadata:
 *     type: object
 *     description: The tax region's metadata.
 *   tax_region_id:
 *     type: string
 *     title: tax_region_id
 *     description: The tax region's tax region id.
 *   is_combinable:
 *     type: boolean
 *     title: is_combinable
 *     description: The tax region's is combinable.
 *   is_default:
 *     type: boolean
 *     title: is_default
 *     description: The tax region's is default.
 *   parent_id:
 *     type: string
 *     title: parent_id
 *     description: The tax region's parent id.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The tax region's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The tax region's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The tax region's deleted at.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The tax region's created by.
 *   tax_rates:
 *     type: array
 *     description: The tax region's tax rates.
 *     items:
 *       $ref: "#/components/schemas/AdminTaxRate"
 *   parent:
 *     $ref: "#/components/schemas/AdminTaxRegion"
 *   children:
 *     type: array
 *     description: The tax region's children.
 *     items:
 *       $ref: "#/components/schemas/AdminTaxRegion"
 * 
*/

