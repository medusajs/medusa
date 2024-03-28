import { defaultStoreCustomersFields, defaultStoreCustomersRelations, allowedStoreCustomersRelations } from "."
import { FindParams } from "../../../../types/common"
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /store/customers/me
 * operationId: GetCustomersCustomer
 * summary: Get a Customer
 * description: "Retrieve the logged-in Customer's details."
 * x-authenticated: true
 * x-codegen:
 *   method: retrieve
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged
 *       medusa.customers.retrieve()
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useMeCustomer } from "medusa-react"
 *
 *       const Customer = () => {
 *         const { customer, isLoading } = useMeCustomer()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {customer && (
 *               <span>{customer.first_name} {customer.last_name}</span>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default Customer
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/store/customers/me' \
 *       -H 'Authorization: Bearer {access_token}'
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Customers
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCustomersRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const id = req.user.customer_id

  const validated = await validator(FindParams, req.query)

  const customerService: CustomerService = req.scope.resolve("customerService")

  let expandFields: string[] = []
  if (validated.expand) {
    expandFields = validated.expand.split(",").filter((f) =>
      allowedStoreCustomersRelations.includes(f)
    )
  }

  const findConfig = {
    relations: expandFields.length
      ? expandFields
      : defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields
  }

  const customer = await customerService.retrieve(id, findConfig)

  res.json({ customer })
}
