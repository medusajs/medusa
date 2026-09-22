/**
 * @schema AdminSearchIndexReindexResponse
 * type: object
 * description: |-
 *   The result of triggering a search index reindex. The reindex runs in the
 *   background - check the index's `status` to know when it's done.
 * x-schemaName: AdminSearchIndexReindexResponse
 * required:
 *   - job_id
 *   - indexes
 * properties:
 *   job_id:
 *     type: string
 *     title: job_id
 *     description: Identifier of the triggered reindex job.
 *   indexes:
 *     type: array
 *     description: Names of the indexes being reindexed.
 *     items:
 *       type: string
 *       title: indexes
 *       description: The index's indexes.
 * 
*/

