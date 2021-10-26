import { defaultRelations, defaultFields } from "./"

/**
 * @oas [delete] /customers/{id}/addresses/{address_id}
 * operationId: DeleteCustomersCustomerAddressesAddress
 * summary: Delete an Address
 * description: "Removes an Address from the Customer's saved addresse."
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
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

  const customerService = req.scope.resolve("customerService")
  await customerService.removeAddress(id, address_id)
  const customer = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
  })

  res.json({ customer })
}
