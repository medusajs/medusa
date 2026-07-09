/**
 * @schema AdminRbacRole
 * type: object
 * description: The details of an RBAC role.
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
 *     description: The ID of the RBAC role.
 *   name:
 *     type: string
 *     title: name
 *     description: The name of the RBAC role.
 *   description:
 *     type: string
 *     title: description
 *     description: The description of the RBAC role.
 *   parent_id:
 *     type: string
 *     title: parent_id
 *     description: The ID of the parent RBAC role.
 *   metadata:
 *     type: object
 *     description: Key-value pairs that hold additional information about the RBAC role.
 *   policies:
 *     type: array
 *     description: The RBAC role's policies.
 *     items:
 *       $ref: "#/components/schemas/AdminRbacPolicy"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the RBAC role was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the RBAC role was last updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the RBAC role was deleted.
 * 
*/

