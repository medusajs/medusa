/**
 * @oas [post] /admin/layouts/{zone}/configuration
 * operationId: PostLayoutsZoneConfiguration
 * summary: Add Layout Configuration
 * description: Add a layout configuration for a specific zone. This allows you to customize the layout of the admin dashboard for that zone, including the arrangement of widgets and other UI elements.
 * x-authenticated: true
 * parameters:
 *   - name: zone
 *     in: path
 *     description: The zone for which the layout configuration should be added.
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
 *         $ref: "#/components/schemas/AdminSetLayoutConfiguration"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/layouts/{zone}/configuration' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "configuration": {
 *           "widgets": {}
 *         }
 *       }'
 * tags:
 *   - Layouts
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminLayoutConfigurationResponse"
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
 * x-workflow: setLayoutConfigurationWorkflow
 * x-events: []
 * x-since: 2.17.2
 * 
*/

