/**
 * @oas [get] /store/customers/me/addresses
 * operationId: GetCustomersMeAddresses
 * summary: List Customer's Addresses
 * x-sidebary-summary: List Addresses
 * description: Retrieve the addresses of the logged-in customer. The addresses can be filtered by fields such as `country_code`. The addresses can also be sorted or paginated.
 * x-authenticated: true
 * externalDocs:
 *   url: https://docs.medusajs.com/resources/storefront-development/customers/addresses#list-customer-addresses
 *   description: "Storefront guide: How to retrieve the logged-in customer's addresses."
 * parameters:
 *   - name: x-publishable-api-key
 *     in: header
 *     description: Publishable API Key created in the Medusa Admin.
 *     required: true
 *     schema:
 *       type: string
 *       externalDocs:
 *         url: https://docs.medusajs.com/api/store#publishable-api-key
 *   - name: x-medusa-locale
 *     in: header
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 *   - name: city
 *     in: query
 *     description: Filter by the address's city.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: city
 *           description: Filter by a city.
 *         - type: array
 *           description: Filter by cities.
 *           items:
 *             type: string
 *             title: city
 *             description: A city.
 *   - name: postal_code
 *     in: query
 *     description: Filter by the address's postal code.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: postal_code
 *           description: Filter by a postal code.
 *         - type: array
 *           description: Filter by postal codes.
 *           items:
 *             type: string
 *             title: postal_code
 *             description: A postal code.
 *   - name: country_code
 *     in: query
 *     description: Filter by the address's country code.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: country_code
 *           description: Filter by a country code.
 *         - type: array
 *           description: Filter by country codes.
 *           items:
 *             type: string
 *             title: country_code
 *             description: A country code.
 *   - name: q
 *     in: query
 *     description: Search term to filter the address's searchable properties.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search term to filter the address's searchable properties.
 *   - name: company
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: company
 *           description: Filter addresses by company.
 *         - type: array
 *           description: Filter addresses by companies.
 *           items:
 *             type: string
 *             title: company
 *             description: A company.
 *   - name: province
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: province
 *           description: Filter addresses by province.
 *         - type: array
 *           description: Filter addresses by provinces.
 *           items:
 *             type: string
 *             title: province
 *             description: A province.
 *   - name: $and
 *     in: query
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
 *   - name: locale
 *     in: query
 *     description: The locale in BCP 47 format to retrieve localized content.
 *     required: false
 *     schema:
 *       type: string
 *       example: en-US
 *       externalDocs:
 *         url: https://docs.medusajs.com/resources/commerce-modules/translation/storefront
 *         description: Learn more in the Serve Translations in Storefront guide.
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       let MEDUSA_BACKEND_URL = "http://localhost:9000"
 * 
 *       if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
 *         MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
 *       }
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: MEDUSA_BACKEND_URL,
 *         debug: process.env.NODE_ENV === "development",
 *         publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
 *       })
 * 
 *       // TODO must be authenticated as the customer to list their addresses
 *       sdk.store.customer.listAddress()
 *       .then(({ addresses, count, offset, limit }) => {
 *         console.log(addresses)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/customers/me/addresses' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCustomerAddressListResponse"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * 
*/

