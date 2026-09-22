/**
 * @schema AdminSearchIndexListResponse
 * type: object
 * description: The list of registered search indexes.
 * x-schemaName: AdminSearchIndexListResponse
 * required:
 *   - search_indexes
 *   - enabled
 * properties:
 *   search_indexes:
 *     type: array
 *     description: The registered search indexes.
 *     items:
 *       $ref: "#/components/schemas/AdminSearchIndex"
 *   enabled:
 *     type: boolean
 *     title: enabled
 *     description: Whether the Search Module is enabled. When `false`, `search_indexes` is empty.
 * 
*/

