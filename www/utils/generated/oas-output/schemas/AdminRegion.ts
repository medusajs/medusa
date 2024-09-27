/**
 * @schema AdminRegion
 * type: object
 * description: The region's details.
 * x-schemaName: AdminRegion
 * required:
 *   - name
 *   - currency_code
 *   - id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The region's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The region's name.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The region's currency code.
 *     example: usd
 *   automatic_taxes:
 *     type: boolean
 *     title: automatic_taxes
 *     description: Whether taxes are applied automatically during checkout.
 *   countries:
 *     type: array
 *     description: The region's countries.
 *     items:
 *       $ref: "#/components/schemas/AdminRegionCountry"
 *   payment_providers:
 *     type: array
 *     description: The region's payment providers.
 *     items:
 *       $ref: "#/components/schemas/AdminPaymentProvider"
 *   metadata:
 *     type: object
 *     description: The region's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the region was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the region was updated.
 * 
*/

