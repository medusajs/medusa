import { IsEmail, IsObject, IsOptional, IsString } from "class-validator"
import { MedusaError } from "medusa-core-utils"
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers/{id}
 * operationId: "PostCustomersCustomer"
 * summary: "Update a Customer"
 * description: "Updates a Customer."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The id of the Customer.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           email:
 *             type: string
 *             description: The Customer's email. Only providable if user not registered.
 *           first_name:
 *             type: string
 *             description:  The Customer's first name.
 *           last_name:
 *             type: string
 *             description:  The Customer's last name.
 *           phone:
 *             type: string
 *             description: The Customer's phone number.
 *           password:
 *             type: string
 *             description: The Customer's password.
 *           metadata:
 *             type: object
 *             description: Metadata for the customer.
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
  const { id } = req.params

  const validated = await validator(AdminPostCustomersCustomerReq, req.body)

  const customerService: CustomerService = req.scope.resolve("customerService")

  let customer = await customerService.retrieve(id)

  if (validated.email && customer.has_account) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Email cannot be changed when the user has registered their account"
    )
  }

  await customerService.update(id, validated)

  customer = await customerService.retrieve(id, {
    relations: ["orders"],
  })
  res.status(200).json({ customer })
}

export class AdminPostCustomersCustomerReq {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  first_name?: string

  @IsString()
  @IsOptional()
  last_name?: string

  @IsString()
  @IsOptional()
  password?: string

  @IsString()
  @IsOptional()
  phone?: string

  @IsObject()
  @IsOptional()
  metadata?: object
}
