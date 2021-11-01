import { defaultRelations, defaultFields } from "./"

/**
 * @oas [get] /customers/me
 * operationId: GetCustomersCustomer
 * summary: Retrieves a Customer
 * description: "Retrieves a Customer - the Customer must be logged in to retrieve their details."
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
  const customerService = req.scope.resolve("customerService")
  const customer = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
  })
  res.json({ customer })
}
