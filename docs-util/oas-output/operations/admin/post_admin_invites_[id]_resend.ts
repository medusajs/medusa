/**
 * @oas [post] /admin/invites/{id}/resend
 * operationId: PostInvitesIdResend
 * summary: Add Resends to Invite
 * description: Add a list of resends to a invite.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The invite's ID.
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
 *       curl -X POST '{backend_url}/admin/invites/{id}/resend' \
 *       -H 'x-medusa-access-token: {api_token}'
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema: {}
 * 
*/

