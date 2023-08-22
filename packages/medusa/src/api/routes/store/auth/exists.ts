import CustomerService from "../../../../services/customer"

/**
 * @oas [get] /store/auth/{email}
 * operationId: "GetAuthEmail"
 * summary: "Check if Email Exists"
 * description: "Check if there's a customer already registered with the provided email."
 * parameters:
 *   - in: path
 *     name: email
 *     schema:
 *       type: string
 *       format: email
 *     required: true
 *     description: The email to check.
 * x-codegen:
 *   method: exists
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.auth.exists("user@example.com")
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/auth/user@example.com'
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreGetAuthEmailRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { email } = req.params

  try {
    const customerService: CustomerService =
      req.scope.resolve("customerService")
    const customer = await customerService.retrieveRegisteredByEmail(email, {
      select: ["id", "has_account"],
    })
    res.status(200).json({ exists: customer.has_account })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}
