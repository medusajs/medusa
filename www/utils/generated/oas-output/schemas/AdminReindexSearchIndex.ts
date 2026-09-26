/**
 * @schema AdminReindexSearchIndex
 * type: object
 * description: The details of the reindexing to trigger on a search index. All properties are optional, so sending an empty request body rebuilds the entire index.
 * x-schemaName: AdminReindexSearchIndex
 * properties:
 *   since:
 *     type: string
 *     format: date-time
 *     title: since
 *     description: Rebuild only the documents that changed at or after this date, as an ISO 8601 date-time string. Like `filters`, this always rebuilds the index in place, as a version built from a subset
 *       of documents is never swapped in.
 *   filters:
 *     type: object
 *     description: "Filters passed to the `seed` function of the index definition to rebuild only a subset of the index's documents. The accepted shape is defined by the index, such as `{ ids:
 *       [\"prod_123\"] }` if the index supports it."
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/infrastructure-modules/search/index-definitions
 *       description: Learn about search index definitions and their seed function
 *   strategy:
 *     type: string
 *     description: How to rebuild the index. `swap` builds a new version of the index and swaps it in once it's ready, whereas `in_place` rewrites the version that's currently serving documents. This
 *       property is ignored, and the rebuild always runs in place, when `filters` or `since` is set.
 *     default: swap
 *     enum:
 *       - swap
 *       - in_place
 * 
*/

