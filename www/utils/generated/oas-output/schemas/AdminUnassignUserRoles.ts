/**
 * @schema AdminUnassignUserRoles
 * type: object
 * description: The RBAC roles to unassign from a user.
 * x-schemaName: AdminUnassignUserRoles
 * properties:
 *   assignments:
 *     type: array
 *     description: The roles to unassign from the user.
 *     items:
 *       type: object
 *       description: A role to unassign from the user.
 *       required:
 *         - role_id
 *       properties:
 *         role_id:
 *           type: string
 *           title: role_id
 *           description: The ID of the role to unassign from the user.
 *         scope:
 *           type: string
 *           title: scope
 *           description: The type of the scope's entity, such as `organization`. Must be passed with `scope_id`.
 *         scope_id:
 *           type: string
 *           title: scope_id
 *           description: The ID of the scope's entity, such as `org_123`. Must be passed with `scope`.
 * 
*/

