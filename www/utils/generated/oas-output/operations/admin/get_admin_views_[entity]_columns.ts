/**
 * @oas [get] /admin/views/{entity}/columns
 * operationId: GetViewsEntityColumns
 * summary: List Columns in View
 * x-sidebar-summary: List Columns
 * description: Retrieve a list of columns in a view for an entity. The columns are retrieved for the authenticated admin user.
 * x-authenticated: true
 * parameters:
 *   - name: entity
 *     in: path
 *     description: The entity to retrieve its columns (for example, `orders`)
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
 *       const { columns } = await sdk.admin.views.columns("orders")
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/views/{entity}/columns' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Views
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminViewsEntityColumnsResponse"
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
 * x-since: 2.10.3
 * x-featureFlag: view_configurations
 * 
*/

