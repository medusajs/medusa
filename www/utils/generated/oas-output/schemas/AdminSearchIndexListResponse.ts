/**
 * @schema AdminSearchIndexListResponse
 * type: object
 * description: The list of search indexes registered in the application.
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
 *     description: Whether the Search Module is installed in the application. When `false`, `search_indexes` is an empty array.
 * 
*/

