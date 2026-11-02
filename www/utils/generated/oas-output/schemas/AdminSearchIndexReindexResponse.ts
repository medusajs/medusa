/**
 * @schema AdminSearchIndexReindexResponse
 * type: object
 * description: The details of the reindexing triggered on a search index. The reindexing runs in the background, so use the List Search Indexes API route to check the index's `status` and know when it's done.
 * x-schemaName: AdminSearchIndexReindexResponse
 * required:
 *   - job_id
 *   - indexes
 * properties:
 *   job_id:
 *     type: string
 *     title: job_id
 *     description: The ID of the triggered reindexing job.
 *   indexes:
 *     type: array
 *     description: The names of the indexes being reindexed.
 *     items:
 *       type: string
 *       title: indexes
 *       description: The search index's name.
 * 
*/

