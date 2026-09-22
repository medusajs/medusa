/**
 * @oas [delete] /admin/search-indexes/{id}
 * operationId: DeleteSearchIndexesId
 * summary: Delete a Search Index
 * description: Delete a search index.
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
 *       sdk.admin.search.deleteIndex("product")
 *       .then(({ deleted, deleted_versions }) => {
 *         console.log(deleted, deleted_versions)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/search-indexes/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Search Indexes
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminSearchIndexDeleteResponse"
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
 * x-workflow: deleteSearchIndexWorkflow
 * x-events: []
 * 
*/

