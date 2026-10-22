/**
 * @schema SearchPagination
 * type: object
 * description: How a search query's results are paginated and sorted.
 * x-schemaName: SearchPagination
 * properties:
 *   skip:
 *     type: number
 *     title: skip
 *     description: The number of documents to skip before the returned hits. It's mutually exclusive with `cursor`.
 *   take:
 *     type: number
 *     title: take
 *     description: The maximum number of hits to return.
 *   order:
 *     type: object
 *     description: The fields to sort the hits by, keyed by each field's dotted path. The reserved `_score` key sorts by relevance.
 *   cursor:
 *     type: string
 *     title: cursor
 *     description: An opaque provider cursor, as returned in a previous result's `metadata.next_cursor`. It's mutually exclusive with `skip`.
 * 
*/

