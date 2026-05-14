/**
 * @schema AdminLocale
 * type: object
 * description: The locale's details.
 * x-schemaName: AdminLocale
 * required:
 *   - code
 *   - name
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   code:
 *     type: string
 *     title: code
 *     description: The locale's code in BCP 47 format.
 *     example: fr-FR
 *   name:
 *     type: string
 *     title: name
 *     description: The locale's display name.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date and time at which the locale was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date and time at which the locale was last updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date and time at which the locale was deleted.
 * 
*/

