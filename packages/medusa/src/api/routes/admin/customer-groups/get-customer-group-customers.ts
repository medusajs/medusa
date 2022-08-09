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
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/customer-groups/{id}/customers' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Customer Group
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customers:
 *               type: array
 *               items:
 *                  $ref: "#/components/schemas/customer"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
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
