import { Request, Response } from "express"

import CustomerController from "../../../../controllers/customers"

/**
 * @oas [get] /customer-groups/{id}/customers
 * operationId: "GetCustomerGroupsGroupCustomers"
 * summary: "List Customers"
 * description: "Retrieves a list of customers in a customer group"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the customer group.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customerGroups.listCustomers(customer_group_id)
 *       .then(({ customers }) => {
 *         console.log(customers.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/customer-groups/{id}/customers' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Customer Group
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
export default async (req: Request, res: Response) => {
  const { id } = req.params

  req.query.groups = [id]

  const result = await CustomerController.listAndCount(
    req.scope,
    req.query,
    req.body
  )

  res.json(result)
}
