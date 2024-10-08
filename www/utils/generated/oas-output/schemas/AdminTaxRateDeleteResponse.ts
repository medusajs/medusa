/**
 * @schema AdminTaxRateDeleteResponse
 * type: object
 * description: The details of the tax rate deletion.
 * x-schemaName: AdminTaxRateDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The tax rate's ID.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: tax_rate
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the tax rate was deleted.
 * 
*/

