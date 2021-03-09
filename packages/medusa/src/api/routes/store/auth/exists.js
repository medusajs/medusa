import { Validator, MedusaError } from "medusa-core-utils"

/**
 * @oas [get] /auth/{email}
 * operationId: "GetAuthEmail"
 * summary: "Check if email has account"
 * description: "Checks if a Customer with the given email has signed up."
 * parameters:
 *   - (path) email=* {string} The Customer's email.
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
 */
export default async (req, res) => {
  const { email } = req.params

  try {
    const customerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieveByEmail(email)
    res.status(200).json({ exists: !!customer.password_hash })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}
