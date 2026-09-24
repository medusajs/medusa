/**
 * @oas [get] /admin/search-indexes
 * operationId: GetSearchIndexes
 * summary: List Search Indexes
 * description: Retrieve the list of search indexes registered in your application, including each index's provider, lifecycle status, and the fields it stores. If the Search Module isn't installed in
 *   your application, `enabled` is `false` and `search_indexes` is an empty array.
 * externalDocs:
 *   description: Learn about the Search Module
 *   url: https://docs.medusajs.com/resources/infrastructure-modules/search
 * x-authenticated: true
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
 *       sdk.admin.search.listIndexes()
 *       .then(({ search_indexes, enabled }) => {
 *         console.log(search_indexes, enabled)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/search-indexes' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Search Indexes
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSearchIndexListResponse"
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

