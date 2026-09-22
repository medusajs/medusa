/**
 * @schema AdminSearchIndex
 * type: object
 * description: A registered search index and the fields it stores.
 * x-schemaName: AdminSearchIndex
 * required:
 *   - name
 *   - entity
 *   - provider
 *   - status
 *   - fields
 * properties:
 *   name:
 *     type: string
 *     title: name
 *     description: Unique index name, as used in `query.search({ entity })`.
 *   entity:
 *     type: string
 *     title: entity
 *     description: The `query.graph` entrypoint used to hydrate non-indexed fields.
 *   provider:
 *     type: string
 *     title: provider
 *     description: Identifier of the provider backing this index.
 *   status:
 *     type: string
 *     description: Lifecycle status of the index.
 *     enum:
 *       - error
 *       - pending
 *       - building
 *       - ready
 *   fields:
 *     type: array
 *     description: Leaf fields stored in the index.
 *     items:
 *       $ref: "#/components/schemas/AdminSearchIndexField"
 * 
*/

