/**
 * @oas [post] /admin/invites/accept
 * operationId: PostInvitesAccept
 * summary: Accept Invite
 * description: >
 *   Accept an invite and create a new user.
 * 
 *   Since the user isn't created yet, the JWT token used in the authorization header is retrieved from the `/auth/user/emailpass/register` API route (or a provider other than `emailpass`). The user can then authenticate using the `/auth/user/emailpass` API route.
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The details of the user to be created.
 *         properties:
 *           email:
 *             type: string
 *             title: email
 *             description: The user's email.
 *             format: email
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The user's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The user's last name.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/invites/accept' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "Lila_Zemlak@hotmail.com",
 *         "first_name": "{value}",
 *         "last_name": "{value}"
 *       }'
 * tags:
 *   - Invites
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           oneOf:
 *             - type: object
 *               description: The created user's details.
 *               required:
 *                 - user
 *               properties:
 *                 user:
 *                   $ref: "#/components/schemas/AdminUser"
 *             - type: object
 *               description: An error's details.
 *               required:
 *                 - message
 *               properties:
 *                 message:
 *                   type: string
 *                   title: message
 *                   description: The error message.
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
 * x-workflow: acceptInviteWorkflow
 * 
*/

