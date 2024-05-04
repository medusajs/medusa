import CustomerService from "../../../../services/customer"
import { defaultRelations } from "."

/**
 * @oas [get] /store/auth
 * operationId: "GetAuth"
 * summary: "Get Current Customer"
 * description: "Retrieve the currently logged in Customer's details."
 * x-authenticated: true
 * x-codegen:
 *   method: getSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged
 *       medusa.auth.getSession()
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/auth' \
 *       -H 'Authorization: Bearer {access_token}'
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreAuthRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
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
  const customerService: CustomerService = req.scope.resolve("customerService")

  const customer = await customerService.retrieve(req.user.customer_id, {
    relations: defaultRelations,
  })

  res.json({ customer })
}
