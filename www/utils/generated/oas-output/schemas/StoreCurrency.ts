/**
 * @schema StoreCurrency
 * type: object
 * description: The currency's details.
 * x-schemaName: StoreCurrency
 * required:
 *   - code
 *   - symbol
 *   - symbol_native
 *   - name
 *   - decimal_digits
 *   - rounding
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   code:
 *     type: string
 *     title: code
 *     description: The currency's code.
 *     example: usd
 *   symbol:
 *     type: string
 *     title: symbol
 *     description: The currency's symbol.
 *   symbol_native:
 *     type: string
 *     title: symbol_native
 *     description: The currency's symbol native.
 *   name:
 *     type: string
 *     title: name
 *     description: The currency's name.
 *   decimal_digits:
 *     type: number
 *     title: decimal_digits
 *     description: The currency's decimal digits.
 *   rounding:
 *     type: number
 *     title: rounding
 *     description: The currency's rounding.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the currency was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the currency was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the currency was deleted.
 * 
*/

