/**
 * @oas [get] /admin/layouts/{zone}/configuration
 * operationId: GetLayoutsZoneConfiguration
 * summary: List Layout Configurations
 * description: Retrieve a list of layout configurations for a specific zone. These are the configurations made by the users for their admin dashboard layouts.
 * x-authenticated: true
 * parameters:
 *   - name: zone
 *     in: path
 *     description: The zone for which the layout configurations should be retrieved.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/layouts/{zone}/configuration' \
 *       -H 'Authorization: Bearer {access_token}'
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
 * x-since: 2.17.2
 * 
*/

