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
 *     description: The rate to charge.
 *     example: 10
 *   code:
 *     type: string
 *     title: code
 *     description: The code the tax rate is identified by.
 *   name:
 *     type: string
 *     title: name
 *     description: The tax rate's name.
 *   metadata:
 *     type: object
 *     description: The tax rate's metadata, can hold custom key-value pairs.
 *   tax_region_id:
 *     type: string
 *     title: tax_region_id
 *     description: The ID of the tax region this rate belongs to.
 *   is_combinable:
 *     type: boolean
 *     title: is_combinable
 *     description: Whether the tax rate should be combined with parent rates.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/tax/tax-rates-and-rules#combinable-tax-rates
 *   is_default:
 *     type: boolean
 *     title: is_default
 *     description: Whether this tax rate is the default in the tax region.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the tax rate was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the tax rate was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the tax rate was deleted.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The ID of the user that created the tax rate.
 *   tax_region:
 *     $ref: "#/components/schemas/AdminTaxRegion"
 *   rules:
 *     type: array
 *     description: The tax rate's rules.
 *     items:
 *       $ref: "#/components/schemas/AdminTaxRateRule"
 * 
*/

