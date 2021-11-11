<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/get-customer.ts
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
=======
import { CustomerResponse, defaultFields, defaultRelations } from "."
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/get-customer.js
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
<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/get-customer.ts
  const customerService: CustomerService = req.scope.resolve("customerService")
=======
  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/get-customer.js
  const customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })
  res.json({ customer })
}

export type StoreGetCustomerResponse = {
  customer: CustomerResponse
}
