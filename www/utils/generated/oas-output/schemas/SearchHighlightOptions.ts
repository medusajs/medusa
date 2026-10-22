/**
 * @schema SearchHighlightOptions
 * type: object
 * description: How the matched terms are highlighted in a search result's hits.
 * x-schemaName: SearchHighlightOptions
 * required:
 *   - fields
 * properties:
 *   fields:
 *     type: array
 *     description: The dotted paths of the fields to highlight.
 *     items:
 *       type: string
 *       title: fields
 *       description: A field's dotted path.
 *   pre_tag:
 *     type: string
 *     title: pre_tag
 *     description: The tag inserted before a matched term. Defaults to `<mark>`.
 *   post_tag:
 *     type: string
 *     title: post_tag
 *     description: The tag inserted after a matched term. Defaults to `</mark>`.
 *   snippet:
 *     oneOf:
 *       - type: boolean
 *         title: snippet
 *         description: Whether to crop a fragment around the match rather than returning the whole field, optionally specifying the fragment's length.
 *       - type: object
 *         description: Whether to crop a fragment around the match rather than returning the whole field, optionally specifying the fragment's length.
 *         required:
 *           - length
 *         properties:
 *           length:
 *             type: number
 *             title: length
 *             description: The length of the cropped fragment.
 * 
*/

