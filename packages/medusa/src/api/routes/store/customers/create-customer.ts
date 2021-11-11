import { IsEmail, IsString } from "class-validator"
<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/create-customer.ts
import jwt from "jsonwebtoken"
import { defaultStoreCustomersFields, defaultStoreCustomersRelations } from "."
import { Customer } from "../../../.."
=======
import jwt, { Secret } from "jsonwebtoken"
import { CustomerResponse, defaultFields, defaultRelations } from "."
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/create-customer.js
import config from "../../../../config"
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

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
<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/create-customer.ts
  const validated = await validator(StorePostCustomersReq, req.body)

  const customerService: CustomerService = req.scope.resolve("customerService")
  let customer: Customer = await customerService.create(validated)

  // Add JWT to cookie
  req.session.jwt = jwt.sign({ customer_id: customer.id }, config.jwtSecret!, {
    expiresIn: "30d",
  })
=======
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
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/create-customer.js

  customer = await customerService.retrieve(customer.id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.status(200).json({ customer })
}

<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/create-customer.ts
export class StorePostCustomersReq {
=======
export class StoreCreateCustomerRequest {
  @IsEmail()
  email: string
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/create-customer.js
  @IsString()
  first_name: string
  @IsString()
  last_name: string
<<<<<<< HEAD:packages/medusa/src/api/routes/store/customers/create-customer.ts
  @IsEmail()
  email: string
  @IsString()
  password: string
}
=======
  @IsString()
  password: string
}

export type StoreCreateCustomerResponse = {
  customer: CustomerResponse
}
>>>>>>> 7053485425693d82237149186811e37953055bff:packages/medusa/src/api/routes/store/customers/create-customer.js
