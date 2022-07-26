import { Request, Response } from "express"

import CustomerController from "../../../../controllers/customers"

/**
 * @oas [get] /customer-groups/{id}/customers
 * operationId: "GetCustomerGroupsGroupCustomers"
 * summary: "List Customers"
 * description: "Retrieves a list of customers in a customer group"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the customer group.
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
