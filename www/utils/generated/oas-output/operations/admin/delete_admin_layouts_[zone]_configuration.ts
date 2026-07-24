/**
 * @oas [delete] /admin/layouts/{zone}/configuration
 * operationId: DeleteLayoutsZoneConfiguration
 * summary: Clear Configuration of Layout
 * description: Clears all user layout configurations for a given zone. This action will remove any customizations made by the user and revert to the system defaults.
 * x-authenticated: true
 * parameters:
 *   - name: zone
 *     in: path
 *     description: The zone for which the layout configuration should be cleared.
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
 *       curl -X DELETE '{backend_url}/admin/layouts/{zone}/configuration' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Layouts
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The details of the layout configuration deletion result.
 *           required:
 *             - success
 *           properties:
 *             success:
 *               type: boolean
 *               title: success
 *               description: Whether the layout configuration was successfully cleared.
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
 * x-workflow: clearLayoutConfigurationWorkflow
 * x-events: []
 * x-since: 2.17.2
 * 
*/

