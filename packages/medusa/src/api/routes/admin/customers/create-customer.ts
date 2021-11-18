import { IsEmail, IsObject, IsOptional, IsString } from "class-validator"
import { CustomerService } from "../../../../services"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers
 * operationId: "PostCustomers"
 * summary: "Create a Customer"
 * description: "Creates a Customer."
 * x-authenticated: true
 * parameters:
 *   - (body) email=* {string} The Customer's email address.
 *   - (body) first_name=* {string} The Customer's first name.
 *   - (body) last_name=* {string} The Customer's last name.
 *   - (body) phone {string} The Customer's phone number.
 *   - (body) metadata {object} Metadata for the customer.
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
  const validated = await validator(AdminPostCustomersReq, req.bodyn)

  const customerService: CustomerService = req.scope.resolve("customerService")
  const customer = await customerService.create(validated)
  res.status(201).json({ customer })
}

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
  metadata?: object
}
