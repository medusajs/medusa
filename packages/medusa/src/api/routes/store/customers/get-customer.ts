import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."

import CustomerService from "../../../../services/customer"

/**
 * @oas [get] /customers/me
 * operationId: GetCustomersCustomer
 * summary: Retrieves a Customer
 * description: "Retrieves a Customer - the Customer must be logged in to retrieve their details."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged
 *       medusa.customers.retrieve()
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/customers/me' \
 *       --header 'Cookie: connect.sid={sid}'
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

  const customerService: CustomerService = req.scope.resolve("customerService")

  const customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.json({ customer })
}
