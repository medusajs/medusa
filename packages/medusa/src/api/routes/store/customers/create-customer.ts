import { IsEmail, IsOptional, IsString } from "class-validator"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."

import jwt from "jsonwebtoken"
import { EntityManager } from "typeorm"
import { Customer } from "../../../.."
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /store/customers
 * operationId: PostCustomers
 * summary: Create a Customer
 * description: "Creates a Customer account."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCustomersReq"
 * x-codegen:
 *   method: create
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.customers.create({
 *         first_name: 'Alec',
 *         last_name: 'Reynolds',
 *         email: 'user@example.com',
 *         password: 'supersecret'
 *       })
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/customers' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "first_name": "Alec",
 *           "last_name": "Reynolds",
 *           "email": "user@example.com",
 *           "password": "supersecret"
 *       }'
 * tags:
 *   - Customers
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCustomersRes"
 *   422:
 *     description: A customer with the same email exists
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               description: The error code
 *             type:
 *               type: string
 *               description: The type of error
 *             message:
 *               type: string
 *               description: Human-readable message with details about the error
 *         example:
 *           code: "invalid_request_error"
 *           type: "duplicate_error"
 *           message: "A customer with the given email already has an account. Log in instead"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const validated = await validator(StorePostCustomersReq, req.body)

  const customerService: CustomerService = req.scope.resolve("customerService")
  const manager: EntityManager = req.scope.resolve("manager")
  let customer: Customer = await manager.transaction(
    async (transactionManager) => {
      return await customerService
        .withTransaction(transactionManager)
        .create(validated)
    }
  )

  customer = await customerService.retrieve(customer.id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  // Add JWT to cookie
  const {
    projectConfig: { jwt_secret },
  } = req.scope.resolve("configModule")
  req.session.jwt_store = jwt.sign({ customer_id: customer.id }, jwt_secret!, {
    expiresIn: "30d",
  })

  res.status(200).json({ customer })
}

/**
 * @schema StorePostCustomersReq
 * type: object
 * required:
 *   - first_name
 *   - last_name
 *   - email
 *   - password
 * properties:
 *   first_name:
 *     description: "The Customer's first name."
 *     type: string
 *   last_name:
 *     description: "The Customer's last name."
 *     type: string
 *   email:
 *     description: "The email of the customer."
 *     type: string
 *     format: email
 *   password:
 *     description: "The Customer's password."
 *     type: string
 *     format: password
 *   phone:
 *     description: "The Customer's phone number."
 *     type: string
 */
export class StorePostCustomersReq {
  @IsString()
  @IsOptional()
  first_name: string

  @IsString()
  @IsOptional()
  last_name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  phone?: string
}
