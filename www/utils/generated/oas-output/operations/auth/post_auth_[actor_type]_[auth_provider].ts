/**
 * @oas [post] /auth/{actor_type}/{auth_provider}
 * operationId: PostActor_typeAuth_provider
 * summary: Add  to [actor_type]
 * description: Add a list of  to a [actor_type].
 * x-authenticated: false
 * parameters:
 *   - name: actor_type
 *     in: path
 *     description: The [actor type]'s actor type.
 *     required: true
 *     schema:
 *       type: string
 *   - name: auth_provider
 *     in: path
 *     description: The [actor type]'s auth provider.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/{actor_type}/{auth_provider}'
 * tags:
 *   - "[actor_type]"
 * responses:
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

