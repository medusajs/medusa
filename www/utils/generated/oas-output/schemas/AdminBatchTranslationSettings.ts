/**
 * @schema AdminBatchTranslationSettings
 * type: object
 * description: The translation settings to create, update, or delete in batch.
 * x-schemaName: AdminBatchTranslationSettings
 * properties:
 *   create:
 *     type: array
 *     description: The translation settings to create.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateTranslationSettings"
 *   update:
 *     type: array
 *     description: The translation settings to update.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateTranslationSettings"
 *   delete:
 *     type: array
 *     description: The translation settings to delete.
 *     items:
 *       type: string
 *       title: delete
 *       description: The IDs of the translation settings to delete.
 * 
*/

