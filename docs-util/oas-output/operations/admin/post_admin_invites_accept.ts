/**
 * @oas [post] /admin/invites/accept
 * operationId: PostInvitesAccept
 * summary: Create Invite
 * description: Create a invite.
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
 *           - email
 *           - first_name
 *           - last_name
 *         properties:
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The invite's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The invite's last name.
 *           email:
 *             type: string
 *             title: email
 *             description: The invite's email.
 *             format: email
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/invites/accept' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "first_name": "{value}",
 *         "last_name": "{value}"
 *       }'
 * tags:
 *   - Invites
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

