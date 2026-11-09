/**
 * @schema AdminRbacRoleAssignment
 * type: object
 * description: The assignment's assignments.
 * x-schemaName: AdminRbacRoleAssignment
 * required:
 *   - id
 *   - role_id
 *   - reference
 *   - reference_id
 *   - scope
 *   - scope_id
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The assignment's ID.
 *   role_id:
 *     type: string
 *     title: role_id
 *     description: The ID of the role the assignment is for.
 *   reference:
 *     type: string
 *     title: reference
 *     description: The type of entity the role is assigned to (e.g. `user`, `invite`).
 *   reference_id:
 *     type: string
 *     title: reference_id
 *     description: The ID of the entity the role is assigned to.
 *   scope:
 *     type: string
 *     title: scope
 *     description: The assignment's scope.
 *   scope_id:
 *     type: string
 *     title: scope_id
 *     description: The assignment's scope id.
 *   metadata:
 *     type: object
 *     description: The assignment's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the assignment was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the assignment was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the assignment was deleted.
 * 
*/

