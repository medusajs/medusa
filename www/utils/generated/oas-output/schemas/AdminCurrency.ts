/**
 * @schema AdminCurrency
 * type: object
 * description: The currency's currencies.
 * x-schemaName: AdminCurrency
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
 *     example: $
 *   symbol_native:
 *     type: string
 *     title: symbol_native
 *     description: The currency's native symbol, if different than the symbol.
 *     example: $
 *   name:
 *     type: string
 *     title: name
 *     description: The currency's name.
 *   decimal_digits:
 *     type: number
 *     title: decimal_digits
 *     description: The number of digits after the decimal for prices in this currency.
 *   rounding:
 *     type: number
 *     title: rounding
 *     description: The rounding percision applied on prices in this currency.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The currency's creation date.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The currency's update date.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The currency's deletion date.
 * 
*/

