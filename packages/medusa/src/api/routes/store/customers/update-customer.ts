import { IsEmail, IsObject, IsOptional, IsString } from "class-validator"
import { CustomerResponse, defaultFields, defaultRelations } from "."
import CustomerService from "../../../../services/customer"
import { IsType } from "../../../../utils/is-type"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers/me
 * operationId: PostCustomersCustomer
 * summary: Update Customer details
 * description: "Updates a Customer's saved details."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           first_name:
 *             description: "The Customer's first name."
 *             type: string
 *           last_name:
 *             description: "The Customer's last name."
 *             type: string
 *           billing_address:
 *             description: "The Address to be used for billing purposes."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 *           password:
 *             description: "The Customer's password."
 *             type: string
 *           phone:
 *             description: "The Customer's phone number."
 *             type: string
 *           email:
 *             description: "The email of the customer."
 *             type: string
 *           metadata:
 *             description: "Metadata about the customer."
 *             type: object
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

  const validated = await validator(StoreUpdateCustomerRequest, req.body)
  console.log(validated)

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService
  await customerService.update(id, validated)

  const customer: CustomerResponse = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
  })

  res.status(200).json({ customer })
}

export class AddressPayload {
  @IsOptional()
  @IsString()
  first_name: string
  @IsOptional()
  @IsString()
  last_name: string
  @IsOptional()
  @IsString()
  phone: string
  @IsOptional()
  metadata: object
  @IsOptional()
  @IsString()
  company: string
  @IsOptional()
  @IsString()
  address_1: string
  @IsOptional()
  @IsString()
  address_2: string
  @IsOptional()
  @IsString()
  city: string
  @IsOptional()
  @IsString()
  country_code: string
  @IsOptional()
  @IsString()
  province: string
  @IsOptional()
  @IsString()
  postal_code: string
}

export class StoreUpdateCustomerRequest {
  @IsOptional()
  @IsEmail()
  email?: string
  @IsOptional()
  @IsType(["address", "string"])
  billing_address?: AddressPayload | string
  @IsOptional()
  @IsString()
  first_name?: string
  @IsOptional()
  @IsString()
  last_name?: string
  @IsOptional()
  @IsString()
  password?: string
  @IsOptional()
  @IsString()
  phone?: string
  @IsOptional()
  metadata?: object
}

export class StoreUpdateCustomerResponse {
  customer: CustomerResponse
}
