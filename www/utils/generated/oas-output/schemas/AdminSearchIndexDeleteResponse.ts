/**
 * @schema AdminSearchIndexDeleteResponse
 * type: object
 * description: The details of deleting a search index. Every physical index built for it is dropped, so the next time search index migrations run, the index is built again from scratch at version 1.
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
 *     description: The name of the deleted search index.
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: search_index
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the search index was deleted successfully.
 *   deleted_versions:
 *     type: number
 *     title: deleted_versions
 *     description: The number of the index's versions that were dropped. It's `0` when the index is registered but was never migrated.
 * 
*/

