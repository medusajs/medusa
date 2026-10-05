/**
 * @schema AdminSearchIndex
 * type: object
 * description: A search index registered in the application, and the fields it stores.
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
 *     description: The index's unique name, which is the name you pass to `query.search({ entity })` to search the index.
 *   entity:
 *     type: string
 *     title: entity
 *     description: The name of the data model that `query.graph` uses as an entry point to retrieve fields that aren't stored in the index.
 *   provider:
 *     type: string
 *     title: provider
 *     description: The identifier of the Search Module Provider backing this index, such as `pg-search`.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/infrastructure-modules/search/providers
 *       description: Learn about Search Module Providers
 *   status:
 *     type: string
 *     description: The index's lifecycle status. `pending` means the index was created but isn't filled yet, `building` means a seed or reindexing is in progress, `ready` means the index is serving
 *       documents, and `error` means the last seed or reindexing failed.
 *     enum:
 *       - error
 *       - pending
 *       - building
 *       - ready
 *   fields:
 *     type: array
 *     description: The leaf fields stored in the index, each with the capabilities declared on it.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/infrastructure-modules/search/index-definitions/fields
 *       description: Learn about search index field types and modifiers
 *     items:
 *       $ref: "#/components/schemas/AdminSearchIndexField"
 * 
*/

