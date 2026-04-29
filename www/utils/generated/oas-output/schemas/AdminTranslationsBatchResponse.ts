/**
 * @schema AdminTranslationsBatchResponse
 * type: object
 * description: The batch response for managing translations.
 * x-schemaName: AdminTranslationsBatchResponse
 * required:
 *   - created
 *   - updated
 *   - deleted
 * properties:
 *   created:
 *     type: array
 *     description: The created translations.
 *     items:
 *       $ref: "#/components/schemas/AdminTranslation"
 *   updated:
 *     type: array
 *     description: The updated translations.
 *     items:
 *       $ref: "#/components/schemas/AdminTranslation"
 *   deleted:
 *     type: object
 *     description: Summary of the deleted translations.
 *     required:
 *       - ids
 *       - object
 *       - deleted
 *     properties:
 *       ids:
 *         type: array
 *         description: The IDs of the deleted translations.
 *         items:
 *           type: string
 *           title: ids
 *           description: A translation ID.
 *       object:
 *         type: string
 *         title: object
 *         description: The type of object deleted.
 *         default: translation
 *       deleted:
 *         type: boolean
 *         title: deleted
 *         description: Whether the translations were successfully deleted.
 * 
*/

