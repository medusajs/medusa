/**
 * @schema StoreCustomer
 * type: object
 * description: The customer's parent.
 * x-schemaName: StoreCustomer
 * required:
 *   - id
 *   - email
 *   - default_billing_address_id
 *   - default_shipping_address_id
 *   - company_name
 *   - first_name
 *   - last_name
 *   - addresses
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The parent's ID.
 *   email:
 *     type: string
 *     title: email
 *     description: The parent's email.
 *     format: email
 *   default_billing_address_id:
 *     type: string
 *     title: default_billing_address_id
 *     description: The parent's default billing address id.
 *   default_shipping_address_id:
 *     type: string
 *     title: default_shipping_address_id
 *     description: The parent's default shipping address id.
 *   company_name:
 *     type: string
 *     title: company_name
 *     description: The parent's company name.
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The parent's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The parent's last name.
 *   addresses:
 *     type: array
 *     description: The parent's addresses.
 *     items:
 *       $ref: "#/components/schemas/BaseCustomerAddress"
 *   phone:
 *     type: string
 *     title: phone
 *     description: The parent's phone.
 *   metadata:
 *     type: object
 *     description: The parent's metadata.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The parent's created by.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The parent's deleted at.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The parent's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The parent's updated at.
 * 
*/

