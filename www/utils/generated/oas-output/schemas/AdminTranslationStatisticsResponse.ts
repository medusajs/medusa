/**
 * @schema AdminTranslationStatisticsResponse
 * type: object
 * description: The translation statistics details.
 * x-schemaName: AdminTranslationStatisticsResponse
 * required:
 *   - statistics
 * properties:
 *   statistics:
 *     type: object
 *     description: The translation statistics for different entity types. The key is the entity type, and the value is an object containing the statistics for that entity type.
 *     example:
 *       product:
 *         expected: 150
 *         translated: 120
 *         missing: 30
 *         by_locale:
 *           fr-FR:
 *             expected: 150
 *             translated: 120
 *             missing: 30
 *     required:
 *       - by_locale
 *       - expected
 *       - translated
 *       - missing
 *     additionalProperties:
 *       type: object
 *       properties:
 *         by_locale:
 *           type: object
 *           description: The translation statistics of an entity type broken down by locale. The key is the locale code in BCP 47 format, and the value is an object containing the statistics for that locale.
 *           example:
 *             fr-FR:
 *               expected: 150
 *               translated: 120
 *               missing: 30
 *           required:
 *             - expected
 *             - translated
 *             - missing
 *           additionalProperties:
 *             type: object
 *             properties:
 *               expected:
 *                 type: number
 *                 title: expected
 *                 description: The total number of translatable fields.
 *               translated:
 *                 type: number
 *                 title: translated
 *                 description: The number of translated fields.
 *               missing:
 *                 type: number
 *                 title: missing
 *                 description: The number of fields that are yet to be translated.
 *         expected:
 *           type: number
 *           title: expected
 *           description: The total number of translatable fields across specified locales.
 *         translated:
 *           type: number
 *           title: translated
 *           description: The number of translated fields across specified locales.
 *         missing:
 *           type: number
 *           title: missing
 *           description: The number of fields that are yet to be translated across specified locales.
 * 
*/

