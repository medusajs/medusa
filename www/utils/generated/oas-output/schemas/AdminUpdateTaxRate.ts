/**
 * @schema AdminUpdateTaxRate
 * type: object
 * description: The properties to update in the tax rate.
 * x-schemaName: AdminUpdateTaxRate
 * properties:
 *   rate:
 *     type: number
 *     title: rate
 *     description: The rate to charge.
 *   code:
 *     type: string
 *     title: code
 *     description: The code that the tax rate is identified by.
 *   rules:
 *     type: array
 *     description: The tax rate's rules.
 *     items:
 *       type: object
 *       description: A tax rate rule.
 *       required:
 *         - reference
 *         - reference_id
 *       properties:
 *         reference:
 *           type: string
 *           title: reference
 *           description: The name of the table this rule references.
 *           example: product_type
 *         reference_id:
 *           type: string
 *           title: reference_id
 *           description: The ID of the record in the table that the rule references.
 *           example: ptyp_123
 *   name:
 *     type: string
 *     title: name
 *     description: The tax rate's name.
 *   is_default:
 *     type: boolean
 *     title: is_default
 *     description: Whether the tax rate is the default in the store.
 *   is_combinable:
 *     type: boolean
 *     title: is_combinable
 *     description: Whether the tax rate should be combined with parent rates.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/tax/tax-rates-and-rules#combinable-tax-rates
 *   metadata:
 *     type: object
 *     description: The tax rate's metadata, can hold custom key-value pairs.
 * 
*/

