/**
 * @schema StoreCartAddress
 * type: object
 * description: The cart's billing address.
 * x-schemaName: StoreCartAddress
 * required:
 *   - id
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The billing address's ID.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The billing address's customer id.
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The billing address's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The billing address's last name.
 *   phone:
 *     type: string
 *     title: phone
 *     description: The billing address's phone.
 *   company:
 *     type: string
 *     title: company
 *     description: The billing address's company.
 *   address_1:
 *     type: string
 *     title: address_1
 *     description: The billing address's address 1.
 *   address_2:
 *     type: string
 *     title: address_2
 *     description: The billing address's address 2.
 *   city:
 *     type: string
 *     title: city
 *     description: The billing address's city.
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The billing address's country code.
 *   province:
 *     type: string
 *     title: province
 *     description: The billing address's province.
 *   postal_code:
 *     type: string
 *     title: postal_code
 *     description: The billing address's postal code.
 *   metadata:
 *     type: object
 *     description: The billing address's metadata.
 *   created_at:
 *     oneOf:
 *       - type: string
 *         title: created_at
 *         description: The billing address's created at.
 *       - type: string
 *         title: created_at
 *         description: The billing address's created at.
 *         format: date-time
 *   updated_at:
 *     oneOf:
 *       - type: string
 *         title: updated_at
 *         description: The billing address's updated at.
 *       - type: string
 *         title: updated_at
 *         description: The billing address's updated at.
 *         format: date-time
 * 
*/

