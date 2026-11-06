/**
 * @oas [get] /rbac/me/permissions
 * operationId: GetMePermissions
 * summary: List Logged-In Actor's Permissions
 * description: Retrieve the permissions of the logged-in actor, such as a user, as a flat list of `resource:operation` strings. Wildcard permissions are expanded into the permissions they cover.
 * x-authenticated: false
 * parameters:
 *   - name: scope
 *     in: query
 *     description: The me's scope.
 *     required: false
 *     schema:
 *       type: string
 *       title: scope
 *       description: The me's scope.
 *   - name: scope_id
 *     in: query
 *     description: The me's scope id.
 *     required: false
 *     schema:
 *       type: string
 *       title: scope_id
 *       description: The me's scope id.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/rbac/me/permissions'
 * tags:
 *   - Me
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacMePermissionsResponse"
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
 * x-since: 2.22.3
 * 
*/

