<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/delete-address.ts
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
=======
import { defaultRelations, defaultFields, CustomerResponse } from "."
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/delete-address.js
import CustomerService from "../../../../services/customer"

/**
 * @oas [delete] /customers/me/addresses/{address_id}
 * operationId: DeleteCustomersCustomerAddressesAddress
 * summary: Delete an Address
 * description: "Removes an Address from the Customer's saved addresse."
 * x-authenticated: true
 * parameters:
 *   - (path) address_id=* {string} The id of the Address to remove.
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
  const { address_id } = req.params

<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/delete-address.ts
  const customerService: CustomerService = req.scope.resolve("customerService")
=======
  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/delete-address.js
  await customerService.removeAddress(id, address_id)
  const customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.json({ customer })
}

export type StoreDeleteCustomerAddressResponse = {
  customer: CustomerResponse
}
