import { IsEmail, IsObject, IsOptional, IsString } from "class-validator"

import { CustomerService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"

/**
 * @oas [post] /customers
 * operationId: "PostCustomers"
 * summary: "Create a Customer"
 * description: "Creates a Customer."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostCustomersReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customers.create({
 *         email: 'user@example.com',
 *         first_name: 'Caterina',
 *         last_name: 'Yost',
 *         password: 'supersecret'
 *       })
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/customers' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com",
 *           "first_name": "Caterina",
 *           "last_name": "Yost",
 *           "password": "supersecret"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Customer
 * responses:
 *   201:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomersRes"
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
  const validated = await validator(AdminPostCustomersReq, req.body)

  const customerService: CustomerService = req.scope.resolve("customerService")
  const manager: EntityManager = req.scope.resolve("manager")
  const customer = await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .create(validated)
  })
  res.status(201).json({ customer })
}

/**
 * @schema AdminPostCustomersReq
 * type: object
 * required:
 *   - email
 *   - first_name
 *   - last_name
 *   - password
 * properties:
 *   email:
 *     type: string
 *     description: The customer's email.
 *     format: email
 *   first_name:
 *     type: string
 *     description: The customer's first name.
 *   last_name:
 *     type: string
 *     description: The customer's last name.
 *   password:
 *     type: string
 *     description: The customer's password.
 *     format: password
 *   phone:
 *     type: string
 *     description: The customer's phone number.
 *   metadata:
 *     description: An optional set of key-value pairs to hold additional information.
 *     type: object
 */
export class AdminPostCustomersReq {
  @IsEmail()
  email: string

  @IsString()
  first_name: string

  @IsString()
  last_name: string

  @IsString()
  password: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}
