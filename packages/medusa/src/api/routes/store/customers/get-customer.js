/**
 * @oas [get] /customers/{id}
 * operationId: GetCustomersCustomer
 * summary: Retrieves a Customer
 * description: "Retrieves a Customer - the Customer must be logged in to retrieve their details."
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
  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieve(id, {
      relations: ["shipping_addresses"],
    })
    res.json({ customer })
  } catch (err) {
    throw err
  }
}
