/**
 * @oas [post] /admin/invites/accept
 * operationId: PostInvitesAccept
 * summary: Accept Invite
 * description: >
 *   Accept an invite and create a new user.
 * 
 *   Since the user isn't created yet, the JWT token used in the authorization header is retrieved from the `/auth/user/emailpass/register` API route (or a provider other than `emailpass`). The user can
 *   then authenticate using the `/auth/user/emailpass` API route.
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminInviteAccept"
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
 *       await sdk.auth.register("user", "emailpass", {
 *         email: "user@gmail.com",
 *         password: "supersecret"
 *       })
 * 
 *       // all subsequent requests will use the token in the header
 *       const { user } = await sdk.admin.invite.accept(
 *         {
 *           email: "user@gmail.com",
 *           first_name: "John",
 *           last_name: "Smith",
 *           invite_token: "12345..."
 *         },
 *       )
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
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-events:
 *   - name: user.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the user
 *       }
 *       ```
 *     description: Emitted when users are created.
 *     deprecated: false
 *   - name: invite.accepted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the invite
 *       }
 *       ```
 *     description: Emitted when an invite is accepted.
 *     deprecated: false
 * 
*/

