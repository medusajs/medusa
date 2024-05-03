/**
 * @schema UpdateCartData
 * type: object
 * description: SUMMARY
 * x-schemaName: UpdateCartData
 * properties:
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The cart's region id.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The cart's customer id.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The cart's sales channel id.
 *   email:
 *     type: string
 *     title: email
 *     description: The cart's email.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The cart's currency code.
 *   shipping_address_id:
 *     type: string
 *     title: shipping_address_id
 *     description: The cart's shipping address id.
 *   billing_address_id:
 *     type: string
 *     title: billing_address_id
 *     description: The cart's billing address id.
 *   billing_address:
 *     oneOf:
 *       - type: object
 *         description: The cart's billing address.
 *         x-schemaName: CreateAddress
 *         properties:
 *           customer_id:
 *             type: string
 *             title: customer_id
 *             description: The billing address's customer id.
 *           company:
 *             type: string
 *             title: company
 *             description: The billing address's company.
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The billing address's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The billing address's last name.
 *           address_1:
 *             type: string
 *             title: address_1
 *             description: The billing address's address 1.
 *           address_2:
 *             type: string
 *             title: address_2
 *             description: The billing address's address 2.
 *           city:
 *             type: string
 *             title: city
 *             description: The billing address's city.
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The billing address's country code.
 *           province:
 *             type: string
 *             title: province
 *             description: The billing address's province.
 *           postal_code:
 *             type: string
 *             title: postal_code
 *             description: The billing address's postal code.
 *           phone:
 *             type: string
 *             title: phone
 *             description: The billing address's phone.
 *           metadata:
 *             type: object
 *             description: The billing address's metadata.
 *             properties: {}
 *       - type: object
 *         description: The cart's billing address.
 *         x-schemaName: UpdateAddress
 *         required:
 *           - id
 *         properties:
 *           id:
 *             type: string
 *             title: id
 *             description: The billing address's ID.
 *           customer_id:
 *             type: string
 *             title: customer_id
 *             description: The billing address's customer id.
 *           company:
 *             type: string
 *             title: company
 *             description: The billing address's company.
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The billing address's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The billing address's last name.
 *           address_1:
 *             type: string
 *             title: address_1
 *             description: The billing address's address 1.
 *           address_2:
 *             type: string
 *             title: address_2
 *             description: The billing address's address 2.
 *           city:
 *             type: string
 *             title: city
 *             description: The billing address's city.
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The billing address's country code.
 *           province:
 *             type: string
 *             title: province
 *             description: The billing address's province.
 *           postal_code:
 *             type: string
 *             title: postal_code
 *             description: The billing address's postal code.
 *           phone:
 *             type: string
 *             title: phone
 *             description: The billing address's phone.
 *           metadata:
 *             type: object
 *             description: The billing address's metadata.
 *             properties: {}
 *   shipping_address:
 *     oneOf:
 *       - type: object
 *         description: The cart's shipping address.
 *         x-schemaName: CreateAddress
 *         properties:
 *           customer_id:
 *             type: string
 *             title: customer_id
 *             description: The shipping address's customer id.
 *           company:
 *             type: string
 *             title: company
 *             description: The shipping address's company.
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The shipping address's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The shipping address's last name.
 *           address_1:
 *             type: string
 *             title: address_1
 *             description: The shipping address's address 1.
 *           address_2:
 *             type: string
 *             title: address_2
 *             description: The shipping address's address 2.
 *           city:
 *             type: string
 *             title: city
 *             description: The shipping address's city.
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The shipping address's country code.
 *           province:
 *             type: string
 *             title: province
 *             description: The shipping address's province.
 *           postal_code:
 *             type: string
 *             title: postal_code
 *             description: The shipping address's postal code.
 *           phone:
 *             type: string
 *             title: phone
 *             description: The shipping address's phone.
 *           metadata:
 *             type: object
 *             description: The shipping address's metadata.
 *             properties: {}
 *       - type: object
 *         description: The cart's shipping address.
 *         x-schemaName: UpdateAddress
 *         required:
 *           - id
 *         properties:
 *           id:
 *             type: string
 *             title: id
 *             description: The shipping address's ID.
 *           customer_id:
 *             type: string
 *             title: customer_id
 *             description: The shipping address's customer id.
 *           company:
 *             type: string
 *             title: company
 *             description: The shipping address's company.
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The shipping address's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The shipping address's last name.
 *           address_1:
 *             type: string
 *             title: address_1
 *             description: The shipping address's address 1.
 *           address_2:
 *             type: string
 *             title: address_2
 *             description: The shipping address's address 2.
 *           city:
 *             type: string
 *             title: city
 *             description: The shipping address's city.
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The shipping address's country code.
 *           province:
 *             type: string
 *             title: province
 *             description: The shipping address's province.
 *           postal_code:
 *             type: string
 *             title: postal_code
 *             description: The shipping address's postal code.
 *           phone:
 *             type: string
 *             title: phone
 *             description: The shipping address's phone.
 *           metadata:
 *             type: object
 *             description: The shipping address's metadata.
 *             properties: {}
 *   metadata:
 *     type: object
 *     description: The cart's metadata.
 *     properties: {}
 * 
*/

