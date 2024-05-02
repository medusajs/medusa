/**
 * @oas [post] /admin/users/{id}
 * operationId: PostUsersId
 * summary: Update a User
 * description: Update a user's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The user's ID.
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
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - first_name
 *           - last_name
 *           - avatar_url
 *         properties:
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The user's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The user's last name.
 *           avatar_url:
 *             type: string
 *             title: avatar_url
 *             description: The user's avatar url.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/users/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "avatar_url": "{value}"
 *       }'
 * tags:
 *   - Users
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

