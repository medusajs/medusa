/**
 * @oas [post] /admin/search-indexes/{id}/reindex
 * operationId: PostSearchIndexesIdReindex
 * summary: Add Reindex to Search Index
 * description: Add a Reindex to a search index
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The search index's ID.
 *     required: true
 *     schema:
 *       type: string
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

