/**
 * @oas [post] /admin/search-indexes/{id}/reindex
 * operationId: PostSearchIndexesIdReindex
 * summary: Reindex a Search Index
 * description: Rebuild a search index's documents using the `seed` function of its index definition. The rebuild runs in the background, so the response is returned immediately with the ID of the
 *   triggered job. Use the List Search Indexes API route to check the index's `status` and know when the rebuild is done.
 * externalDocs:
 *   description: Learn about reindexing and index migrations
 *   url: https://docs.medusajs.com/resources/infrastructure-modules/search/reindexing
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The search index's name, such as `product`.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminReindexSearchIndex"
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
 *       sdk.admin.search.reindex("product")
 *       .then(({ job_id, indexes }) => {
 *         console.log(job_id, indexes)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/search-indexes/{id}/reindex' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Search Indexes
 * responses:
 *   "202":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSearchIndexReindexResponse"
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
 * x-workflow: reindexSearchIndexesWorkflow
 * x-events: []
 * 
*/

