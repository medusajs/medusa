/**
 * @schema AdminFulfillmentAddress
 * type: object
 * description: An address's details.
 * x-schemaName: AdminFulfillmentAddress
 * required:
 *   - id
 *   - fulfillment_id
 *   - company
 *   - first_name
 *   - last_name
 *   - address_1
 *   - address_2
 *   - city
 *   - country_code
 *   - province
 *   - postal_code
 *   - phone
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The address's ID.
 *   fulfillment_id:
 *     type: string
 *     title: fulfillment_id
 *     description: The ID of the fulfillment that the address belongs to.
 *   company:
 *     type: string
 *     title: company
 *     description: The address's company.
 *   first_name:
 *     type: string
 *     title: first_name
 *     description: The address's first name.
 *   last_name:
 *     type: string
 *     title: last_name
 *     description: The address's last name.
 *   address_1:
 *     type: string
 *     title: address_1
 *     description: The address's first line.
 *   address_2:
 *     type: string
 *     title: address_2
 *     description: The address's second line.
 *   city:
 *     type: string
 *     title: city
 *     description: The address's city.
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The address's country code.
 *   province:
 *     type: string
 *     title: province
 *     description: The address's province.
 *   postal_code:
 *     type: string
 *     title: postal_code
 *     description: The address's postal code.
 *   phone:
 *     type: string
 *     title: phone
 *     description: The address's phone.
 *   metadata:
 *     type: object
 *     description: The address's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the address was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the address was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the address was deleted.
 * 
*/

