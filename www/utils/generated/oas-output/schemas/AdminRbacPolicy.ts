/**
 * @schema AdminRbacPolicy
 * type: object
 * description: The policy's policies.
 * x-schemaName: AdminRbacPolicy
 * required:
 *   - id
 *   - key
 *   - resource
 *   - operation
 *   - name
 *   - description
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The policy's ID.
 *   key:
 *     type: string
 *     title: key
 *     description: The policy's key.
 *   resource:
 *     type: string
 *     title: resource
 *     description: The policy's resource.
 *   operation:
 *     type: string
 *     title: operation
 *     description: The policy's operation.
 *   name:
 *     type: string
 *     title: name
 *     description: The policy's name.
 *   description:
 *     type: string
 *     title: description
 *     description: The policy's description.
 *   metadata:
 *     type: object
 *     description: The policy's metadata.
 *   inherited_from_role_id:
 *     type: string
 *     title: inherited_from_role_id
 *     description: The policy's inherited from role id.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The policy's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The policy's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The policy's deleted at.
 * 
*/

