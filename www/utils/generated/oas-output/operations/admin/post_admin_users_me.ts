/**
 * @oas [post] /admin/users/me
 * operationId: PostUsersMe
 * summary: Update Logged-In User
 * description: Update the logged-in user's details. Unlike the Update a User API route, this API route doesn't require the `user:update` permission, so any user can update their own details.
 * x-authenticated: true
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminUpdateUser"
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
 *       sdk.admin.user.updateMe({
 *         first_name: "John",
 *         last_name: "Doe",
 *       })
 *       .then(({ user }) => {
 *         console.log(user)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/users/me' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Users
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUserResponse"
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
 * x-workflow: updateUsersWorkflow
 * x-events:
 *   - name: user.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the user
 *       }
 *       ```
 *     description: Emitted when users are updated.
 *     deprecated: false
 * 
*/

