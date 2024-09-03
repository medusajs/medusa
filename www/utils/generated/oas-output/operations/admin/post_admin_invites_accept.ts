/**
 * @oas [post] /admin/invites/accept
 * operationId: PostInvitesAccept
 * summary: Accept Invite
 * description: >
 *   Accept an invite and create a new user.
 * 
 *   Since the user isn't created yet, the JWT token used in the authorization header is retrieved from the `/auth/user/emailpass/register` API route (or a provider other than `emailpass`).
 *   The user can then authenticate using the `/auth/user/emailpass` API route.
 * x-authenticated: false
 * parameters:
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
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
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The details of the user to be created.
 *         required:
 *           - email
 *           - first_name
 *           - last_name
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

