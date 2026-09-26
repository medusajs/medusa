/**
 * @oas [post] /store/search
 * operationId: PostSearch
 * summary: Search Indexes
 * description: Search the indexes that your application exposes to the storefront. An index is only searchable through this route once it's allowed with the `configureStoreSearch` middleware, and a query for any other index is answered with a `404` error. Pass a single query, or a `queries` array to run a batch of queries in one round-trip to the search engine. For an index whose entity is `product`, Medusa also restricts the results to published products in the sales channels of the request's publishable API key.
 * externalDocs:
 *   description: Learn about the Store Search API route
 *   url: https://docs.medusajs.com/resources/infrastructure-modules/search/store-search
 * x-authenticated: false
 * parameters:
 *   - name: x-publishable-api-key
 *     in: header
 *     description: Publishable API Key created in the Medusa Admin.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://docs.medusajs.com/api/store/publishable-api-key
 *   - name: x-medusa-locale
 *     in: header
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 *   - name: locale
 *     in: query
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         oneOf:
 *           - type: object
 *             description: A batch of queries to run in one round-trip to the search engine.
 *             required:
 *               - queries
 *             properties:
 *               queries:
 *                 type: array
 *                 description: The queries to run, in the order their results are returned in.
 *                 items:
 *                   allOf:
 *                     - type: object
 *                       description: A single query to run against one of the store's search indexes.
 *                       required:
 *                         - entity
 *                       properties:
 *                         entity:
 *                           type: string
 *                           title: entity
 *                           description: |-
 *                             The name of the index to query, which defaults to the index whose name
 *                             equals the entity.
 *                         fields:
 *                           type: array
 *                           description: The dotted paths of the fields the search engine returns. Only fields stored in the search index can be passed here.
 *                           items:
 *                             type: string
 *                             title: fields
 *                             description: A field's dotted path.
 *                         filters:
 *                           allOf:
 *                             - type: object
 *                               description: The filters to apply, including the free-text query as `q`.
 *                               properties:
 *                                 $and:
 *                                   type: array
 *                                   description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                   items:
 *                                     type: object
 *                                   title: $and
 *                                 $or:
 *                                   type: array
 *                                   description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                   items:
 *                                     type: object
 *                                   title: $or
 *                                 $not:
 *                                   allOf:
 *                                     - type: object
 *                                       description: Filter by values not matching the conditions in this parameter.
 *                                       properties:
 *                                         $and:
 *                                           type: array
 *                                           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                           items:
 *                                             type: object
 *                                           title: $and
 *                                         $or:
 *                                           type: array
 *                                           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                           items:
 *                                             type: object
 *                                           title: $or
 *                                         $not:
 *                                           allOf:
 *                                             - type: object
 *                                               description: Filter by values not matching the conditions in this parameter.
 *                                               properties:
 *                                                 $and:
 *                                                   type: array
 *                                                   description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                                   items:
 *                                                     type: object
 *                                                   title: $and
 *                                                 $or:
 *                                                   type: array
 *                                                   description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                                   items:
 *                                                     type: object
 *                                                   title: $or
 *                                                 $not:
 *                                                   allOf:
 *                                                     - type: object
 *                                                       description: Filter by values not matching the conditions in this parameter.
 *                                                       properties:
 *                                                         $and:
 *                                                           type: array
 *                                                           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                                           items:
 *                                                             type: object
 *                                                           title: $and
 *                                                         $or:
 *                                                           type: array
 *                                                           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                                           items:
 *                                                             type: object
 *                                                           title: $or
 *                                                         $not:
 *                                                           allOf:
 *                                                             - type: object
 *                                                               description: Filter by values not matching the conditions in this parameter.
 *                                                             - type: object
 *                                                               description: Filter by values not matching the conditions in this parameter.
 *                                                         q:
 *                                                           type: string
 *                                                           title: q
 *                                                           description: The free-text query to match the documents against.
 *                                                     - type: object
 *                                                       description: Filter by values not matching the conditions in this parameter.
 *                                                 q:
 *                                                   type: string
 *                                                   title: q
 *                                                   description: The free-text query to match the documents against.
 *                                             - type: object
 *                                               description: Filter by values not matching the conditions in this parameter.
 *                                         q:
 *                                           type: string
 *                                           title: q
 *                                           description: The free-text query to match the documents against.
 *                                     - type: object
 *                                       description: Filter by values not matching the conditions in this parameter.
 *                                 q:
 *                                   type: string
 *                                   title: q
 *                                   description: The free-text query to match the documents against.
 *                             - type: object
 *                               description: The filters to apply, including the free-text query as `q`.
 *                         pagination:
 *                           $ref: "#/components/schemas/SearchPagination"
 *                     - type: object
 *                       description: The options changing how the query is matched, scored, and aggregated.
 *                       properties:
 *                         search_options:
 *                           $ref: "#/components/schemas/SearchOptions"
 *           - allOf:
 *               - type: object
 *                 description: A single query to run against one of the store's search indexes.
 *                 required:
 *                   - entity
 *                 properties:
 *                   entity:
 *                     type: string
 *                     title: entity
 *                     description: |-
 *                       The name of the index to query, which defaults to the index whose name
 *                       equals the entity.
 *                   fields:
 *                     type: array
 *                     description: The dotted paths of the fields the search engine returns. Only fields stored in the search index can be passed here.
 *                     items:
 *                       type: string
 *                       title: fields
 *                       description: A field's dotted path.
 *                   filters:
 *                     allOf:
 *                       - type: object
 *                         description: The filters to apply, including the free-text query as `q`.
 *                         properties:
 *                           $and:
 *                             type: array
 *                             description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                             items:
 *                               type: object
 *                             title: $and
 *                           $or:
 *                             type: array
 *                             description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                             items:
 *                               type: object
 *                             title: $or
 *                           $not:
 *                             allOf:
 *                               - type: object
 *                                 description: Filter by values not matching the conditions in this parameter.
 *                                 properties:
 *                                   $and:
 *                                     type: array
 *                                     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                     items:
 *                                       type: object
 *                                     title: $and
 *                                   $or:
 *                                     type: array
 *                                     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                     items:
 *                                       type: object
 *                                     title: $or
 *                                   $not:
 *                                     allOf:
 *                                       - type: object
 *                                         description: Filter by values not matching the conditions in this parameter.
 *                                         properties:
 *                                           $and:
 *                                             type: array
 *                                             description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                             items:
 *                                               type: object
 *                                             title: $and
 *                                           $or:
 *                                             type: array
 *                                             description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                             items:
 *                                               type: object
 *                                             title: $or
 *                                           $not:
 *                                             allOf:
 *                                               - type: object
 *                                                 description: Filter by values not matching the conditions in this parameter.
 *                                                 properties:
 *                                                   $and:
 *                                                     type: array
 *                                                     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                                     items:
 *                                                       type: object
 *                                                     title: $and
 *                                                   $or:
 *                                                     type: array
 *                                                     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                                     items:
 *                                                       type: object
 *                                                     title: $or
 *                                                   $not:
 *                                                     allOf:
 *                                                       - type: object
 *                                                         description: Filter by values not matching the conditions in this parameter.
 *                                                         properties:
 *                                                           $and:
 *                                                             type: array
 *                                                             description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *                                                             items:
 *                                                               type: object
 *                                                             title: $and
 *                                                           $or:
 *                                                             type: array
 *                                                             description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *                                                             items:
 *                                                               type: object
 *                                                             title: $or
 *                                                           $not:
 *                                                             allOf:
 *                                                               - type: object
 *                                                                 description: Filter by values not matching the conditions in this parameter.
 *                                                               - type: object
 *                                                                 description: Filter by values not matching the conditions in this parameter.
 *                                                           q:
 *                                                             type: string
 *                                                             title: q
 *                                                             description: The free-text query to match the documents against.
 *                                                       - type: object
 *                                                         description: Filter by values not matching the conditions in this parameter.
 *                                                   q:
 *                                                     type: string
 *                                                     title: q
 *                                                     description: The free-text query to match the documents against.
 *                                               - type: object
 *                                                 description: Filter by values not matching the conditions in this parameter.
 *                                           q:
 *                                             type: string
 *                                             title: q
 *                                             description: The free-text query to match the documents against.
 *                                       - type: object
 *                                         description: Filter by values not matching the conditions in this parameter.
 *                                   q:
 *                                     type: string
 *                                     title: q
 *                                     description: The free-text query to match the documents against.
 *                               - type: object
 *                                 description: Filter by values not matching the conditions in this parameter.
 *                           q:
 *                             type: string
 *                             title: q
 *                             description: The free-text query to match the documents against.
 *                       - type: object
 *                         description: The filters to apply, including the free-text query as `q`.
 *                   pagination:
 *                     $ref: "#/components/schemas/SearchPagination"
 *               - type: object
 *                 description: The options changing how the query is matched, scored, and aggregated.
 *                 properties:
 *                   search_options:
 *                     $ref: "#/components/schemas/SearchOptions"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/search' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Search
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The results of the search queries.
 *           required:
 *             - results
 *           properties:
 *             results:
 *               type: array
 *               description: The results of the posted queries, in the order they were sent in.
 *               items:
 *                 type: object
 *                 description: The results of one of the posted queries.
 *                 required:
 *                   - hits
 *                   - metadata
 *                 properties:
 *                   hits:
 *                     type: array
 *                     description: The documents matching the query, ordered by the query's sort or by relevance.
 *                     items:
 *                       type: object
 *                       description: A document matching the query.
 *                       required:
 *                         - id
 *                         - document
 *                       properties:
 *                         id:
 *                           type: string
 *                           title: id
 *                           description: |-
 *                             The value of the index's primary key for this document. `query.search` uses
 *                             it to hydrate the rest of the entity through `query.graph`.
 *                         score:
 *                           type: number
 *                           title: score
 *                           description: The hit's relevance score. It's only returned when the query enables `include_score`.
 *                         document:
 *                           type: object
 *                           description: The retrievable fields the search engine returned for this document.
 *                         highlights:
 *                           type: object
 *                           description: The highlighted fragments of the matched fields, keyed by each field's dotted path. They're only returned when the query enables `highlight`.
 *                   facets:
 *                     type: object
 *                     description: The computed facets, keyed by the field they were requested on.
 *                   metadata:
 *                     $ref: "#/components/schemas/SearchResultMetadata"
 *                   provider_metadata:
 *                     type: object
 *                     description: Extra details the search provider returned, passed through as-is.
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * x-since: 2.21.1
 * 
*/

