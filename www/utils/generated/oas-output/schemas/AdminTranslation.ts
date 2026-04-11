/**
 * @schema AdminTranslation
 * type: object
 * description: The translation's details.
 * x-schemaName: AdminTranslation
 * required:
 *   - id
 *   - reference_id
 *   - reference
 *   - locale_code
 *   - translations
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The translation's ID.
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The ID of the resource that the translation belongs to. For example, the ID of a product.
 *     example: prod_123
 *   reference:
 *     type: string
 *     title: reference
 *     description: The resource that the translation belongs to.
 *     example: product
 *   locale_code:
 *     type: string
 *     title: locale_code
 *     description: The translation's locale code in BCP 47 format.
 *     example: fr-FR
 *   translations:
 *     type: object
 *     description: The translation key-value pairs. Each key is a field in the resource, and the value is the translated text.
 *     example:
 *       title: Chaussures
 *       description: Des chaussures élégantes.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date that the translation was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date that the translation was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date that the translation was deleted.
 * 
*/

