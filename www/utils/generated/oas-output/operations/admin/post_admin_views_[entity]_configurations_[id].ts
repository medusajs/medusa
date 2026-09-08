/**
 * @oas [post] /admin/views/{entity}/configurations/{id}
 * operationId: PostViewsEntityConfigurationsId
 * summary: Update View Configuration
 * description: Update the view configuration of an entity. An admin user can only update their own configurations.
 * x-authenticated: true
 * parameters:
 *   - name: entity
 *     in: path
 *     description: The entity to update its view configuration (for example, `orders`).
 *     required: true
 *     schema:
 *       type: string
 *   - name: id
 *     in: path
 *     description: The view configuration's ID.
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
 *         $ref: "#/components/schemas/AdminUpdateViewConfiguration"
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
 *       const { view_configuration } = await sdk.admin.views.updateConfiguration(
 *         "orders",
 *         "viewconfig_123",
 *         {
 *           name: "Updated View",
 *         }
 *       )
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/views/{entity}/configurations/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       -d '{
 *         "is_system_default": true
 *       }'
 * tags:
 *   - Views
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminViewConfigurationResponse"
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
 * x-workflow: updateViewConfigurationWorkflow
 * x-events: []
 * x-since: 2.10.3
 * x-featureFlag: view_configurations
 * 
*/

