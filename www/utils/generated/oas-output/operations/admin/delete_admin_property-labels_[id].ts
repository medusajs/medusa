/**
 * @oas [delete] /admin/property-labels/{id}
 * operationId: DeletePropertyLabelsId
 * summary: Delete a Property Label
 * description: Delete a property label.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The property label's ID.
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
 *       curl -X DELETE '{backend_url}/admin/property-labels/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Property Labels
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPropertyLabelDeleteResponse"
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
 * x-workflow: deletePropertyLabelsWorkflow
 * x-events: []
 * x-since: 2.10.3
 * x-featureFlag: view_configurations
 * 
*/

