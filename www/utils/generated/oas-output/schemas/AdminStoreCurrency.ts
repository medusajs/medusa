/**
 * @schema AdminStoreCurrency
 * type: object
 * description: The details of a store's currency.
 * x-schemaName: AdminStoreCurrency
 * required:
 *   - id
 *   - currency_code
 *   - store_id
 *   - is_default
 *   - currency
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The currency's ID.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The currency's code.
 *     example: usd
 *   store_id:
 *     type: string
 *     title: store_id
 *     description: The ID of the store this currency belongs to.
 *   is_default:
 *     type: boolean
 *     title: is_default
 *     description: Whether this currency is the default in the store.
 *   currency:
 *     $ref: "#/components/schemas/AdminCurrency"
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

