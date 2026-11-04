/**
 * @oas [post] /rbac/roles/{id}/assignments
 * operationId: PostRolesIdAssignments
 * summary: Assign Role
 * description: Assign a role to one or more entities of the same type, such as users or invites. Pass `scope` and `scope_id` to constrain the assignments to a scope. You can only assign roles whose policies you have.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The role's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The entities to assign the role to.
 *         required:
 *           - reference
 *           - reference_ids
 *         properties:
 *           reference:
 *             type: string
 *             title: reference
 *             description: The type of entity to assign the role to, such as `user` or `invite`.
 *           reference_ids:
 *             type: array
 *             description: The IDs of the entities to assign the role to.
 *             items:
 *               type: string
 *               title: reference_ids
 *               description: An entity's ID.
 *           scope:
 *             type: string
 *             title: scope
 *             description: The type of the scope's entity, such as `organization`. Must be passed with `scope_id`.
 *           scope_id:
 *             type: string
 *             title: scope_id
 *             description: The ID of the scope's entity, such as `org_123`. Must be passed with `scope`.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/rbac/roles/{id}/assignments' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "reference": "{value}",
 *         "reference_ids": [
 *           "{value}"
 *         ]
 *       }'
 * tags:
 *   - Roles
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRbacRoleAssignmentsResponse"
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
 * x-workflow: assignRolesWorkflow
 * x-events: []
 * x-since: 2.22.3
 * 
*/

