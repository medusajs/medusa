/**
 * @schema AdminTranslationSettings
 * type: object
 * description: The translation settings details.
 * x-schemaName: AdminTranslationSettings
 * required:
 *   - id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - entity_type
 *   - fields
 *   - is_active
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The ID of the translation settings.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the translation settings was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the translation settings was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the translation settings was deleted.
 *   entity_type:
 *     type: string
 *     title: entity_type
 *     description: The entity type the translation settings are for.
 *     example: product
 *   fields:
 *     type: array
 *     description: The fields supported for translations.
 *     items:
 *       type: string
 *       title: fields
 *       description: A field supported for translations.
 *   is_active:
 *     type: boolean
 *     title: is_active
 *     description: Whether translations are active for the given entity type.
 * 
*/

