import CustomerController from "../../../../controllers/customers"

/**
 * @oas [get] /customer-groups/{id}/customers
 * operationId: "GetCustomerGroupsGroupCustomers"
 * summary: "List Customers"
 * description: "Retrieves a list of Customers."
 * x-authenticated: true
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const { id } = req.params

  req.query.groups = [id]

  const result = await CustomerController.listAndCount(
    req.scope,
    req.query,
    req.body
  )

  res.json(result)
}
