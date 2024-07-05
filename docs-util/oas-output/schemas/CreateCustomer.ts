/**
 * @schema CreateCustomer
 * type: object
 * description: SUMMARY
 * x-schemaName: CreateCustomer
 * properties:
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
 *   email:
 *     type: string
 *     title: email
 *     description: The customer's email.
 *     format: email
 *   phone:
 *     type: string
 *     title: phone
 *     description: The customer's phone.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The customer's created by.
 *   addresses:
 *     type: array
 *     description: The customer's addresses.
 *     items:
 *       type: object
 *       description: The address's addresses.
 *       x-schemaName: CreateCustomerAddress
 *       properties:
 *         address_name:
 *           type: string
 *           title: address_name
 *           description: The address's address name.
 *         is_default_shipping:
 *           type: boolean
 *           title: is_default_shipping
 *           description: The address's is default shipping.
 *         is_default_billing:
 *           type: boolean
 *           title: is_default_billing
 *           description: The address's is default billing.
 *         company:
 *           type: string
 *           title: company
 *           description: The address's company.
 *         first_name:
 *           type: string
 *           title: first_name
 *           description: The address's first name.
 *         last_name:
 *           type: string
 *           title: last_name
 *           description: The address's last name.
 *         address_1:
 *           type: string
 *           title: address_1
 *           description: The address's address 1.
 *         address_2:
 *           type: string
 *           title: address_2
 *           description: The address's address 2.
 *         city:
 *           type: string
 *           title: city
 *           description: The address's city.
 *         country_code:
 *           type: string
 *           title: country_code
 *           description: The address's country code.
 *         province:
 *           type: string
 *           title: province
 *           description: The address's province.
 *         postal_code:
 *           type: string
 *           title: postal_code
 *           description: The address's postal code.
 *         phone:
 *           type: string
 *           title: phone
 *           description: The address's phone.
 *         metadata:
 *           type: object
 *           description: The address's metadata.
 *           properties: {}
 *   metadata:
 *     type: object
 *     description: The customer's metadata.
 *     properties: {}
 * 
*/

