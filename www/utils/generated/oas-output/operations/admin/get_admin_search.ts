/**
 * @oas [get] /admin/search
 * operationId: GetSearch
 * summary: List Search
 * description: Retrieve a list of search. The search can be filtered by fields such as `id`. The search can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
 *   - name: q
 *     in: query
 *     description: The search's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The search's q.
 *   - name: entity
 *     in: query
 *     description: The search's entity.
 *     required: false
 *     schema:
 *       type: array
 *       description: The search's entity.
 *       items:
 *         type: string
 *         title: entity
 *         description: The entity's details.
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
 *           description: SUMMARY
 *           required:
 *             - results
 *           properties:
 *             results:
 *               type: array
 *               description: In the order the entities were requested.
 *               items:
 *                 type: object
 *                 description: The result's results.
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
 *                     description: The result's entity.
 *                   data:
 *                     type: array
 *                     description: The documents the index holds, in relevance order.
 *                     items:
 *                       type: object
 *                       description: The datum's data.
 *                   count:
 *                     type: number
 *                     title: count
 *                     description: Treat as an estimate — most engines only approximate a total.
 *                   offset:
 *                     type: number
 *                     title: offset
 *                     description: The result's offset.
 *                   limit:
 *                     type: number
 *                     title: limit
 *                     description: The result's limit.
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

