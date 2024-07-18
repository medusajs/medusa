/**
 * @schema AdminUpdateTaxRate
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminUpdateTaxRate
 * required:
 *   - code
 *   - metadata
 * properties:
 *   rate:
 *     type: number
 *     title: rate
 *     description: The tax rate's rate.
 *   code:
 *     type: string
 *     title: code
 *     description: The tax rate's code.
 *   rules:
 *     type: array
 *     description: The tax rate's rules.
 *     items:
 *       type: object
 *       description: The rule's rules.
 *       required:
 *         - reference
 *         - reference_id
 *       properties:
 *         reference:
 *           type: string
 *           title: reference
 *           description: The rule's reference.
 *         reference_id:
 *           type: string
 *           title: reference_id
 *           description: The rule's reference id.
 *   name:
 *     type: string
 *     title: name
 *     description: The tax rate's name.
 *   is_default:
 *     type: boolean
 *     title: is_default
 *     description: The tax rate's is default.
 *   is_combinable:
 *     type: boolean
 *     title: is_combinable
 *     description: The tax rate's is combinable.
 *   metadata:
 *     type: object
 *     description: The tax rate's metadata.
 * 
*/

