/**
 * @schema AdminPricePreference
 * type: object
 * description: The price preference's details.
 * x-schemaName: AdminPricePreference
 * required:
 *   - id
 *   - attribute
 *   - value
 *   - is_tax_inclusive
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The price preference's ID.
 *   attribute:
 *     type: string
 *     title: attribute
 *     description: The price preference's attribute.
 *     example: region_id
 *   value:
 *     type: string
 *     title: value
 *     description: The price preference's value.
 *     example: reg_123
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether prices matching this preference include taxes.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the price preference was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the price preference was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the price preference was deleted.
 * 
*/

