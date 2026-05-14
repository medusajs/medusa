/**
 * @oas [post] /admin/invites/{id}/resend
 * operationId: PostInvitesIdResend
 * summary: Refresh Invite Token
 * description: Refresh the token of an invite.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The invite's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.invite.resend("invite_123")
 *       .then(({ invite }) => {
 *         console.log(invite)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/admin/invites/{id}/resend'
 * tags:
 *   - Invites
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminInviteResponse"
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
 * x-workflow: refreshInviteTokensWorkflow
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-events:
 *   - name: invite.resent
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the invite
 *       }
 *       ```
 *     description: |-
 *       Emitted when invites should be resent because their token was
 *       refreshed. You can listen to this event to send an email to the invited users,
 *       for example.
 *     deprecated: false
 * 
*/

