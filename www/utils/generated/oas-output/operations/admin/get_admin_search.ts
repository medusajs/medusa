/**
 * @oas [get] /admin/search
 * operationId: GetSearch
 * summary: Search Admin
 * description: Search entities that have a search index and are defined as search entities in the Medusa Admin.
 * externalDocs:
 *   description: Medusa Admin Search
 *   url: https://docs.medusajs.com/resources/infrastructure-modules/search/admin-search
 * x-authenticated: true
 * parameters:
 *   - name: q
 *     in: query
 *     description: A query to run full-text search against the search index.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: A query to run full-text search against the search index.
 *   - name: entity
 *     in: query
 *     description: The entities to run the search against.
 *     required: false
 *     schema:
 *       type: array
 *       description: The entities to run the search against.
 *       items:
 *         type: string
 *         title: entity
 *         description: The name of the entity.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *       externalDocs:
 *         url: "#pagination"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.search.list({ q: "shirt", limit: 5 })
 *       .then(({ results }) => {
 *         console.log(results)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/search' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Search
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The search results for the requested entities.
 *           required:
 *             - results
 *           properties:
 *             results:
 *               type: array
 *               description: The search results for each entity, in the order the entities were requested.
 *               items:
 *                 type: object
 *                 description: The search result for a specific entity.
 *                 required:
 *                   - entity
 *                   - data
 *                   - count
 *                   - offset
 *                   - limit
 *                 properties:
 *                   entity:
 *                     type: string
 *                     title: entity
 *                     description: The name of the entity the search result belongs to.
 *                   data:
 *                     type: array
 *                     description: The documents the index holds, in relevance order.
 *                     items:
 *                       type: object
 *                       description: The document returned by the search index.
 *                   count:
 *                     type: number
 *                     title: count
 *                     description: An estimate of the total number of documents matching the search query.
 *                   offset:
 *                     type: number
 *                     title: offset
 *                     description: The number of documents to skip before returning results.
 *                   limit:
 *                     type: number
 *                     title: limit
 *                     description: The maximum number of documents to return in the result set.
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
 * 
*/

