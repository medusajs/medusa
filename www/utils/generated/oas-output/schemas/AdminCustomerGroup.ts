/**
 * @schema AdminCustomerGroup
 * type: object
 * description: The group's groups.
 * x-schemaName: AdminCustomerGroup
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
 *       $ref: "#/components/schemas/BaseCustomer"
 *   metadata:
 *     type: object
 *     description: The group's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The group's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The group's updated at.
 * 
*/

