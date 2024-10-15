/**
 * @schema StoreCustomer
 * type: object
 * description: The customer's details.
 * x-schemaName: StoreCustomer
 * required:
 *   - addresses
 *   - id
 *   - email
 *   - company_name
 *   - first_name
 *   - last_name
 *   - default_billing_address_id
 *   - default_shipping_address_id
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
 *   default_billing_address_id:
 *     type: string
 *     title: default_billing_address_id
 *     description: The ID of the address used for billing by default.
 *   default_shipping_address_id:
 *     type: string
 *     title: default_shipping_address_id
 *     description: The ID of the address used for shipping by default.
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
 *       $ref: "#/components/schemas/StoreCustomerAddress"
 *   phone:
 *     type: string
 *     title: phone
 *     description: The customer's phone.
 *   metadata:
 *     type: object
 *     description: The customer's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the customer was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the customer was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the customer was deleted.
 * 
*/

