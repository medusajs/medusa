import { CustomerService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { AdminGetCustomersParams } from "../customers"
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
  const validated = await validator(AdminGetCustomersParams, req.query)

  const customerService: CustomerService = req.scope.resolve("customerService")

  validated.groups = [id]

  const [customers, count] = await CustomerController.listAndCount(
    customerService,
    validated
  )

  res.json({
    customers,
    count,
    offset: validated.offset,
    limit: validated.limit,
  })
}
