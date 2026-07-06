/**
 * @schema AdminUpdateTranslation
 * type: object
 * description: The data for updating a translation.
 * required:
 *   - id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The ID of the translation to update.
 *   reference:
 *     type: string
 *     title: reference
 *     description: The resource that the translation belongs to.
 *     example: product
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The ID of the resource that the translation belongs to. For example, the ID of a product.
 *     example: prod_123
 *   locale_code:
 *     type: string
 *     title: locale_code
 *     description: The translation's locale code in BCP 47 format.
 *     example: fr-FR
 *   translations:
 *     type: object
 *     description: The translation key-value pairs. Each key is a field in the resource, and the value is the translated text.
 *     example:
 *       title: Chaussures Modifiées
 *       description: Des chaussures élégantes et modifiées.
 * x-schemaName: AdminUpdateTranslation
 * 
*/

