/**
 * @schema Customer
 * type: object
 * description: The context's customer.
 * x-schemaName: Customer
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The customer's ID.
 *   email:
 *     type: string
 *     title: email
 *     description: The customer's email.
 *     format: email
 *   has_account:
 *     type: boolean
 *     title: has_account
 *     description: The customer's has account.
 *   default_billing_address_id:
 *     type: string
 *     title: default_billing_address_id
 *     description: The customer's default billing address id.
 *   default_shipping_address_id:
 *     type: string
 *     title: default_shipping_address_id
 *     description: The customer's default shipping address id.
 *   company_name:
 *     type: string
 *     title: company_name
 *     description: The customer's company name.
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The customer's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The customer's last name.
 *   addresses:
 *     type: array
 *     description: The customer's addresses.
 *     items:
 *       $ref: "#/components/schemas/CustomerAddress"
 *   phone:
 *     type: string
 *     title: phone
 *     description: The customer's phone.
 *   groups:
 *     type: array
 *     description: The customer's groups.
 *     items:
 *       type: object
 *       description: The group's groups.
 *       properties: {}
 *   metadata:
 *     type: object
 *     description: The customer's metadata.
 *     properties: {}
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The customer's created by.
 *   deleted_at:
 *     oneOf:
 *       - type: string
 *         title: deleted_at
 *         description: The customer's deleted at.
 *       - type: string
 *         title: deleted_at
 *         description: The customer's deleted at.
 *         format: date-time
 *   created_at:
 *     oneOf:
 *       - type: string
 *         title: created_at
 *         description: The customer's created at.
 *       - type: string
 *         title: created_at
 *         description: The customer's created at.
 *         format: date-time
 *   updated_at:
 *     oneOf:
 *       - type: string
 *         title: updated_at
 *         description: The customer's updated at.
 *       - type: string
 *         title: updated_at
 *         description: The customer's updated at.
 *         format: date-time
 * 
*/

