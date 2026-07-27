/**
 * @oas [post] /admin/views/{entity}/configurations
 * operationId: PostViewsEntityConfigurations
 * summary: Create View Configuration
 * description: Create a new view configuration for an entity. If `is_system_default` is set to true, the created configuration will be set as the system default for the specified entity. Otherwise, it
 *   will be a custom configuration for the admin user.
 * x-authenticated: true
 * parameters:
 *   - name: entity
 *     in: path
 *     description: The entity to create its view configuration (for example, `orders`).
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
 *         $ref: "#/components/schemas/AdminCreateViewConfiguration"
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
 *       const { view_configuration } = await sdk.admin.views.createConfiguration(
 *         "orders",
 *         {
 *           name: "My Orders View",
 *           configuration: {
 *             visible_columns: ["display_id", "status"],
 *             column_order: ["display_id", "status"],
 *           },
 *         }
 *       )
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/views/{entity}/configurations' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       -d '{
 *         "is_system_default": true,
 *         "name": "Custom View"
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
 * x-workflow: createViewConfigurationWorkflow
 * x-events: []
 * x-since: 2.10.3
 * x-featureFlag: view_configurations
 * 
*/

