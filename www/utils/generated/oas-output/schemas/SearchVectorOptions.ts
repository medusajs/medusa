/**
 * @schema SearchVectorOptions
 * type: object
 * description: The options of a vector, or semantic, search.
 * x-schemaName: SearchVectorOptions
 * properties:
 *   field:
 *     type: string
 *     title: field
 *     description: The dotted path of the `vector` field to search in. It's optional when the index declares exactly one vector field.
 *   value:
 *     type: array
 *     description: A pre-computed embedding to search with. It's mutually exclusive with `query`.
 *     items:
 *       type: number
 *       title: value
 *       description: A component of the embedding.
 *   query:
 *     type: string
 *     title: query
 *     description: The text that the search engine embeds at query time. It requires the vector field to enable `embed`, and it's mutually exclusive with `value`.
 *   semantic_ratio:
 *     type: number
 *     title: semantic_ratio
 *     description: How much the semantic score contributes relative to the keyword score, where `0` is keyword-only and `1` is semantic-only. It defaults to `1` when there's no free-text query, and `0.5` when both run together.
 * 
*/

