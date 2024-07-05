/**
 * @oas [get] /auth/{scope}/{auth_provider}
 * operationId: GetScopeAuth_provider
 * summary: "List "
 * description: Retrieve a list of  in a [scope]. The  can be filtered by fields
 *   like FILTER FIELDS. The  can also be paginated.
 * x-authenticated: false
 * parameters:
 *   - name: scope
 *     in: path
 *     description: The [scope]'s scope.
 *     required: true
 *     schema:
 *       type: string
 *   - name: auth_provider
 *     in: path
 *     description: The [scope]'s auth provider.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/auth/{scope}/{auth_provider}'
 * tags:
 *   - "[scope]"
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

