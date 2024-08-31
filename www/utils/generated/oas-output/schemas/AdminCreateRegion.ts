/**
 * @schema AdminCreateRegion
 * type: object
 * description: SUMMARY
 * required:
 *   - name
 *   - currency_code
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: The region's name.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The region's currency code.
 *   countries:
 *     type: array
 *     description: The region's countries.
 *     items:
 *       type: string
 *       title: countries
 *       description: The country's countries.
 *   automatic_taxes:
 *     type: boolean
 *     title: automatic_taxes
 *     description: The region's automatic taxes.
 *   payment_providers:
 *     type: array
 *     description: The region's payment providers.
 *     items:
 *       type: string
 *       title: payment_providers
 *       description: The payment provider's payment providers.
 *   metadata:
 *     type: object
 *     description: The region's metadata.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: The region's is tax inclusive.
 * x-schemaName: AdminCreateRegion
 * 
*/

