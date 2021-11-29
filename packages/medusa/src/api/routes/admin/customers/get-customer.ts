import { CustomerService, ServiceIdentifiers } from "../../../../services"

/**
 * @oas [get] /customers/{id}
 * operationId: "GetCustomersCustomer"
 * summary: "Retrieve a Customer"
 * description: "Retrieves a Customer."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
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
  const customerService: CustomerService = req.scope.resolve(
    ServiceIdentifiers.customerService
  )
  const customer = await customerService.retrieve(id, {
    relations: ["orders", "shipping_addresses"],
  })

  res.json({ customer })
}
