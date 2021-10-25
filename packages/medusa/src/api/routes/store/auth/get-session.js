/**
 * @oas [get] /auth
 * operationId: "GetAuth"
 * summary: "Get Session"
 * description: "Gets the currently logged in Customer."
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  if (req.user && req.user.customer_id) {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieve(req.user.customer_id, {
      relations: ["shipping_addresses", "orders", "orders.items"],
    })
    res.json({ customer })
  } else {
    res.sendStatus(401)
  }
}
