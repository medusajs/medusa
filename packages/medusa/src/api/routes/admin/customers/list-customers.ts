import { IsNumber, IsOptional, IsString } from "class-validator"

import { AdminListCustomerSelector } from "../../../../types/customers"
import { Type } from "class-transformer"
import customerController from "../../../../controllers/customers"

/**
 * @oas [get] /customers
 * operationId: "GetCustomers"
 * summary: "List Customers"
 * description: "Retrieves a list of Customers."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=50 {integer} The number of items to return.
 *   - (query) offset=0 {integer} The items to skip before result.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each customer.
 *   - (query) q {string} a search term to search email, first_name, and last_name.
 *   - (query) groups[] {string} group IDs to search customers by.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetCustomersParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customers.list()
 *       .then(({ customers, limit, offset, count }) => {
 *         console.log(customers.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/customers' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomersListRes"
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
 */
export default async (req, res) => {
  const result = await customerController.listAndCount(
    req.scope,
    req.query,
    req.body
  )

  res.json(result)
}

export class AdminGetCustomersParams extends AdminListCustomerSelector {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  @IsString()
  @IsOptional()
  expand?: string
}
