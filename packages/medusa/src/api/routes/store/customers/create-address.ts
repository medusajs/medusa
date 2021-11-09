import { IsOptional, IsString } from "class-validator"
import { CustomerResponse, defaultFields, defaultRelations } from "."
import CustomerService from "../../../../services/customer"
import { validator } from "../../../../utils/validator"

/**
 * @oas [post] /customers/me/addresses
 * operationId: PostCustomersCustomerAddresses
 * summary: "Add a Shipping Address"
 * description: "Adds a Shipping Address to a Customer's saved addresses."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           address:
 *             description: "The Address to add to the Customer."
 *             anyOf:
 *               - $ref: "#/components/schemas/address"
 * tags:
 *   - Customer
 * responses:
 *  "200":
 *    description: "A successful response"
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  const id = req.user.customer_id

  const validated = await validator(StoreCreateCustomerAddressRequest, req.body)

  const customerService = req.scope.resolve(
    "customerService"
  ) as CustomerService

  let customer = await customerService.addAddress(id, validated)
  customer = await customerService.retrieve(id, {
    relations: defaultRelations,
    select: defaultFields,
  })

  res.status(200).json({ customer })
}

export class StoreCreateCustomerAddressRequest {
  @IsOptional()
  @IsString()
  company?: string
  @IsString()
  first_name: string
  @IsString()
  last_name: string
  @IsString()
  address_1: string
  @IsOptional()
  @IsString()
  address_2?: string
  @IsString()
  city: string
  @IsString()
  country_code: string
  @IsOptional()
  @IsString()
  province?: string
  @IsOptional()
  @IsString()
  phone?: string
}

export type StoreCreateCustomerAddressResponse = {
  customer: CustomerResponse
}
