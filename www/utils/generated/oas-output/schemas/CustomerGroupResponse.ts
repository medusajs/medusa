/**
 * @schema CustomerGroupResponse
 * type: object
 * description: The group's groups.
 * x-schemaName: CustomerGroupResponse
 * required:
 *   - id
 *   - name
 *   - customers
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The group's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The group's name.
 *   customers:
 *     type: array
 *     description: The group's customers.
 *     items:
 *       $ref: "#/components/schemas/CustomerResponse"
 *   metadata:
 *     type: object
 *     description: The group's metadata.
 *     properties: {}
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The group's created at.
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The group's updated at.
 * 
*/

