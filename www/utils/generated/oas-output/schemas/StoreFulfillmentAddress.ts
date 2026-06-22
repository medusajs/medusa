/**
 * @schema StoreFulfillmentAddress
 * type: object
 * description: The location's address details.
 * x-schemaName: StoreFulfillmentAddress
 * required:
 *   - id
 *   - company
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
 *   company:
 *     type: string
 *     title: company
 *     description: The address's company.
 *   address_1:
 *     type: string
 *     title: address_1
 *     description: The first line of the address.
 *   address_2:
 *     type: string
 *     title: address_2
 *     description: The second line of the address.
 *   city:
 *     type: string
 *     title: city
 *     description: The address's city.
 *   country_code:
 *     type: string
 *     title: country_code
 *     description: The address's country code.
 *     example: us
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
 *     description: The address's metadata. Can hold custom key-value pairs.
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

