/**
 * @schema AdminTranslationEntitiesResponse
 * type: object
 * description: The list of translatable entities.
 * x-schemaName: AdminTranslationEntitiesResponse
 * required:
 *   - data
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   data:
 *     type: array
 *     description: The list of translatable entities.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The entity's data.
 *           required:
 *             - id
 *             - translations
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The entity's ID.
 *             translations:
 *               type: array
 *               description: The entity's translations.
 *               items:
 *                 $ref: "#/components/schemas/AdminTranslation"
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of translatable entities.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned items.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned in the response.
 * 
*/

