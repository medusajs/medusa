/**
 * @schema AdminCustomerAddressFilters
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCustomerAddressFilters
 * properties:
 *   q:
 *     type: string
 *     title: q
 *     description: The customer's q.
 *   company:
 *     oneOf:
 *       - type: string
 *         title: company
 *         description: The customer's company.
 *       - type: array
 *         description: The customer's company.
 *         items:
 *           type: string
 *           title: company
 *           description: The company's details.
 *   city:
 *     oneOf:
 *       - type: string
 *         title: city
 *         description: The customer's city.
 *       - type: array
 *         description: The customer's city.
 *         items:
 *           type: string
 *           title: city
 *           description: The city's details.
 *   country_code:
 *     oneOf:
 *       - type: string
 *         title: country_code
 *         description: The customer's country code.
 *       - type: array
 *         description: The customer's country code.
 *         items:
 *           type: string
 *           title: country_code
 *           description: The country code's details.
 *   province:
 *     oneOf:
 *       - type: string
 *         title: province
 *         description: The customer's province.
 *       - type: array
 *         description: The customer's province.
 *         items:
 *           type: string
 *           title: province
 *           description: The province's details.
 *   postal_code:
 *     oneOf:
 *       - type: string
 *         title: postal_code
 *         description: The customer's postal code.
 *       - type: array
 *         description: The customer's postal code.
 *         items:
 *           type: string
 *           title: postal_code
 *           description: The postal code's details.
 *   $and:
 *     type: array
 *     description: The customer's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The customer's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

