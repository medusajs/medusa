import CustomerService from "../../../../services/customer"
/**
 * @oas [get] /auth/{email}
 * operationId: "GetAuthEmail"
 * summary: "Check if email has account"
 * description: "Checks if a Customer with the given email has signed up."
 * parameters:
 *   - in: path
 *     name: email
 *     schema:
 *       type: string
 *       format: email
 *     required: true
 *     description: The email to check if exists.
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            exists:
 *              type: boolean
 *              description: Whether email exists or not.
 */
export default async (req, res) => {
  const { email } = req.params

  try {
    const customerService: CustomerService =
      req.scope.resolve("customerService")
    const customer = await customerService.retrieveByEmail(email, {
      select: ["has_account"],
    })
    res.status(200).json({ exists: customer.has_account })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}
