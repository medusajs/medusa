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
 *   - raw_rounding
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   code:
 *     type: string
 *     title: code
 *     description: The currency's code.
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
 *   raw_rounding:
 *     type: object
 *     description: The currency's raw rounding.
 *     required:
 *       - value
 *       - precision
 *     properties:
 *       value:
 *         type: string
 *         title: value
 *         description: The raw rounding's value.
 *       precision:
 *         type: number
 *         title: precision
 *         description: The raw rounding's precision.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The currency's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The currency's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The currency's deleted at.
 * 
*/

