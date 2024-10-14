/**
 * @oas [post] /admin/invites
 * operationId: PostInvites
 * summary: Create Invite
 * description: Create a invite.
 * x-authenticated: false
 * parameters:
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The invite's details.
 *         required:
 *           - email
 *         properties:
 *           email:
 *             type: string
 *             title: email
 *             description: The email of the user to invite.
 *             format: email
 *           metadata:
 *             type: object
 *             description: The invite's metadata. Can be custom data in key-value pairs.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/invites' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "Whitney_Schultz@gmail.com"
 *       }'
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
 * x-workflow: createInvitesWorkflow
 * 
*/

