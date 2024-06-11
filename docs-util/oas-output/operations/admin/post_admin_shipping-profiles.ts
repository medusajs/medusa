/**
 * @oas [post] /admin/shipping-profiles
 * operationId: PostShippingProfiles
 * summary: Create Shipping Profile
 * description: Create a shipping profile.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - name
 *           - type
 *           - metadata
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The shipping profile's name.
 *           type:
 *             type: string
 *             title: type
 *             description: The shipping profile's type.
 *           metadata:
 *             type: object
 *             description: The shipping profile's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-profiles' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Orie",
 *         "type": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Shipping Profiles
 * responses:
 *   "200":
 *     description: OK
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
 * 
*/

