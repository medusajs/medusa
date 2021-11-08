import jwt, { Secret } from "jsonwebtoken"
import { Validator, MedusaError, validator } from "medusa-core-utils"
import config from "../../../../config"
import { defaultRelations, defaultFields, CustomerResponse } from "."
import { IsEmail } from "class-validator"
import CustomerService from "../../../../services/customer"
import { Customer } from "../../../.."

/**
 * @oas [post] /customers
 * operationId: PostCustomers
 * summary: Create a Customer
 * description: "Creates a Customer account."
 * x-authenticated: true
 * parameters:
 *   - (body) email=* {string} The Customer's email address.
 *   - (body) first_name=* {string} The Customer's first name.
 *   - (body) last_name=* {string} The Customer's last name.
 *   - (body) password=* {string} The Customer's password for login.
 *   - (body) phone {string} The Customer's phone number.
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
  const validated = await validator(StoreCreateCustomerRequest, req.body)

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService
  let customer = await customerService.create(validated)

  // Add JWT to cookie
  req.session.jwt = jwt.sign(
    { customer_id: customer.id },
    config.jwtSecret as Secret,
    {
      expiresIn: "30d",
    }
  )

  customer = await customerService.retrieve(customer.id, {
    relations: defaultRelations,
    select: defaultFields,
  })

  res.status(200).json({ customer })
}

export class StoreCreateCustomerRequest {
  @IsEmail()
  email: string
  first_name: string
  last_name: string
  password: string
}

export type StoreCreateCustomerResponse = {
  customer: CustomerResponse
}
