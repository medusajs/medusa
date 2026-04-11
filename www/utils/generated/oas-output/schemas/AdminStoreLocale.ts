/**
 * @schema AdminStoreLocale
 * type: object
 * description: The details of a store's locale.
 * x-schemaName: AdminStoreLocale
 * required:
 *   - id
 *   - locale_code
 *   - store_id
 *   - locale
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The locale's ID.
 *   locale_code:
 *     type: string
 *     title: locale_code
 *     description: The locale's code in BCP 47 format.
 *   store_id:
 *     type: string
 *     title: store_id
 *     description: The ID of the store to which the locale belongs.
 *   locale:
 *     $ref: "#/components/schemas/AdminLocale"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the locale was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the locale was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the locale was deleted.
 * 
*/

