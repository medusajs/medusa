/**
 * @schema AdminSearchIndexDeleteResponse
 * type: object
 * description: |-
 *   The result of deleting a search index. Every physical index built for it is
 *   dropped, so the next migration rebuilds it from scratch at version 1.
 * x-schemaName: AdminSearchIndexDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 *   - deleted_versions
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The name of the deleted index.
 *   object:
 *     type: string
 *     title: object
 *     description: The type of the item that was deleted.
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the index was deleted successfully.
 *   deleted_versions:
 *     type: number
 *     title: deleted_versions
 *     description: |-
 *       How many of the index's versions were dropped. `0` when the index is
 *       registered but was never migrated.
 * 
*/

