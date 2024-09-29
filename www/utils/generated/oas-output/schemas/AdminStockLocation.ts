/**
 * @schema AdminStockLocation
 * type: object
 * description: The stock location's details.
 * x-schemaName: AdminStockLocation
 * required:
 *   - id
 *   - name
 *   - address_id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The location's ID.
 *   name:
 *     type: string
 *     title: name
 *     description: The location's name.
 *   address_id:
 *     type: string
 *     title: address_id
 *     description: The ID of the associated address.
 *   address:
 *     type: object
 *     description: The details of the stock location address.
 *     x-schemaName: AdminStockLocationAddress
 *     properties:
 *       id:
 *         type: string
 *         title: id
 *         description: The address's ID.
 *       address_1:
 *         type: string
 *         title: address_1
 *         description: The address's first line.
 *       address_2:
 *         type: string
 *         title: address_2
 *         description: The address's second line.
 *       company:
 *         type: string
 *         title: company
 *         description: The address's company.
 *       country_code:
 *         type: string
 *         title: country_code
 *         description: The address's country code.
 *         example: us
 *       city:
 *         type: string
 *         title: city
 *         description: The address's city.
 *       phone:
 *         type: string
 *         title: phone
 *         description: The address's phone.
 *       postal_code:
 *         type: string
 *         title: postal_code
 *         description: The address's postal code.
 *       province:
 *         type: string
 *         title: province
 *         description: The address's province.
 *     required:
 *       - id
 *       - address_1
 *       - address_2
 *       - company
 *       - country_code
 *       - city
 *       - phone
 *       - postal_code
 *       - province
 *   sales_channels:
 *     type: array
 *     description: The sales channels associated with the location.
 *     items:
 *       $ref: "#/components/schemas/AdminSalesChannel"
 *   fulfillment_providers:
 *     type: array
 *     description: The fulfillment providers associated with the location.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentProvider"
 *   fulfillment_sets:
 *     type: array
 *     description: The fulfillment sets associated with the location.
 *     items:
 *       $ref: "#/components/schemas/AdminFulfillmentSet"
 * 
*/

