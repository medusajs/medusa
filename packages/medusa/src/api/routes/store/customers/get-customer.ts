import { CustomerResponse, defaultFields, defaultRelations } from "."
import CustomerService from "../../../../services/customer"

/**
 * @oas [get] /customers/me
 * operationId: GetCustomersCustomer
 * summary: Retrieves a Customer
 * description: "Retrieves a Customer - the Customer must be logged in to retrieve their details."
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
  const id = req.user.customer_id
  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService
  const customer = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
  })
  res.json({ customer })
}

export type StoreGetCustomerResponse = {
  customer: CustomerResponse
}
