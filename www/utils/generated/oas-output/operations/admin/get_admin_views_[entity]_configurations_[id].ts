/**
 * @oas [get] /admin/views/{entity}/configurations/{id}
 * operationId: GetViewsEntityConfigurationsId
 * summary: Get View Configuration
 * description: Retrieve a view configuration for an entity. An admin user can only retrieve their own configurations.
 * x-authenticated: true
 * parameters:
 *   - name: entity
 *     in: path
 *     description: The entity to retrieve its view configurations (for example, `orders`)
 *     required: true
 *     schema:
 *       type: string
 *   - name: id
 *     in: path
 *     description: The ID of the view configuration to retrieve.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
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
 *       sdk.admin.views.retrieveConfiguration("orders", "viewconfig_123")
 *       .then(({ view_configuration }) => {
 *         console.log(view_configuration)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/views/{entity}/configurations/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
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
 * x-since: 2.10.3
 * x-featureFlag: view_configurations
 * 
*/

