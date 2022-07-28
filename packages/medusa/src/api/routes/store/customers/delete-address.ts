import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
import CustomerService from "../../../../services/customer"
import { EntityManager } from "typeorm"

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

  const customerService: CustomerService = req.scope.resolve("customerService")

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .removeAddress(id, address_id)
  })

  const customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.json({ customer })
}
