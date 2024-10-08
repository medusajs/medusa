/**
 * @oas [delete] /admin/price-preferences/{id}
 * operationId: DeletePricePreferencesId
 * summary: Delete a Price Preference
 * description: Delete a price preference.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The price preference's ID.
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
 *       curl -X DELETE '{backend_url}/admin/price-preferences/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Price Preferences
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPricePreferenceDeleteResponse"
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
 * x-workflow: deletePricePreferencesWorkflow
 * 
*/

