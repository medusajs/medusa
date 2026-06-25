/**
 * @schema AdminRbacRole
 * type: object
 * description: The rbac role's rbac roles.
 * x-schemaName: AdminRbacRole
 * required:
 *   - id
 *   - name
 *   - description
 *   - parent_id
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The rbac role's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The rbac role's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The rbac role's description.
 *   parent_id:
 *     type: string
 *     title: parent_id
 *     description: The rbac role's parent id.
 *   metadata:
 *     type: object
 *     description: The rbac role's metadata.
 *   policies:
 *     type: array
 *     description: The rbac role's policies.
 *     items:
 *       $ref: "#/components/schemas/AdminRbacPolicy"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The rbac role's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The rbac role's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The rbac role's deleted at.
 * 
*/

